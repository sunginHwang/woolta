/**
 * Web Push 브라우저 유틸.
 *
 * 권한 요청(`Notification.requestPermission`)과 구독(`pushManager.subscribe`)은
 * iOS 에서 **클릭 핸들러 안에서 직접** 호출해야 한다 — 마운트 시 호출은 조용히 무시된다.
 * 그래서 이 모듈은 등록/조회/구독 조각만 제공하고, 언제 부를지는 호출부(설정 토글)가 정한다.
 */

export type PushSupport =
  /** 브라우저가 Push API 를 모른다 */
  | 'unsupported'
  /** iOS 는 홈 화면에 설치된 웹앱에서만 푸시가 된다 */
  | 'needs-install'
  | 'supported';

/** 서버로 보내는 구독 형태 — `PushSubscription.toJSON()` 에서 필요한 값만 추린다 */
export interface SerializedPushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
  /** ISO 문자열. 대부분 브라우저가 null 을 준다 */
  expirationTime: string | null;
}

/** VAPID 공개키(base64url) → `applicationServerKey` 가 요구하는 바이트 배열 */
export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

export const isIOSDevice = () => {
  if (typeof navigator === 'undefined') {
    return false;
  }

  // iPadOS 13+ 는 데스크톱 UA 를 쓰므로 터치 지원 Mac 도 iOS 로 본다
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  return /iPad|iPhone|iPod/.test(navigator.userAgent) || isTouchMac;
};

/**
 * 홈 화면(설치된 앱)으로 열렸는가.
 * manifest 의 display 가 fullscreen 이면 `standalone` 미디어쿼리는 거짓이라 둘 다 본다.
 */
export const isStandaloneDisplay = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const byMediaQuery =
    typeof window.matchMedia === 'function' &&
    (window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches);

  // Safari 전용 플래그
  const byNavigator = (navigator as Navigator & { standalone?: boolean }).standalone === true;

  return byMediaQuery || byNavigator;
};

export const getPushSupport = (): PushSupport => {
  if (typeof window === 'undefined') {
    return 'unsupported';
  }

  const hasApi = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  if (!hasApi) {
    // iOS Safari 탭은 PushManager 자체가 없다 — 설치하면 생기므로 안내 대상이다
    return isIOSDevice() && !isStandaloneDisplay() ? 'needs-install' : 'unsupported';
  }

  if (isIOSDevice() && !isStandaloneDisplay()) {
    return 'needs-install';
  }

  return 'supported';
};

/**
 * 푸시용 서비스워커 등록. 권한은 건드리지 않는다.
 * `updateViaCache: 'none'` — 서버 캐시 헤더와 별개로 SW 파일은 항상 네트워크에서 다시 본다.
 */
export const registerPushServiceWorker = async (path = '/service-worker.js') => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    return await navigator.serviceWorker.register(path, { scope: '/', updateViaCache: 'none' });
  } catch (error) {
    console.error('[web-push] service worker 등록 실패', error);
    return null;
  }
};

export const getPushSubscription = async (registration: ServiceWorkerRegistration) =>
  registration.pushManager.getSubscription();

/**
 * `navigator.serviceWorker.ready` 는 등록이 실패하면 **영원히 resolve 되지 않는다**(404, HTTP 오리진, 사생활 모드 등).
 * 그대로 await 하면 UI 가 pending 에 갇히므로 타임아웃과 경주시켜 null 로 돌려준다.
 */
export const waitForServiceWorkerReady = async (timeoutMs = 5000): Promise<ServiceWorkerRegistration | null> => {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<null>((resolve) => {
    timer = setTimeout(() => resolve(null), timeoutMs);
  });

  try {
    return await Promise.race([navigator.serviceWorker.ready, timeout]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

const serializeSubscription = (subscription: PushSubscription): SerializedPushSubscription => {
  const json = subscription.toJSON();
  const keys = json.keys ?? {};

  if (!json.endpoint || !keys.p256dh || !keys.auth) {
    throw new Error('[web-push] 구독 정보가 비어 있습니다.');
  }

  return {
    endpoint: json.endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth,
    expirationTime: json.expirationTime == null ? null : new Date(json.expirationTime).toISOString(),
  };
};

const isSameKey = (existing: ArrayBuffer | null | undefined, requested: Uint8Array) => {
  if (!existing) {
    return false;
  }

  const bytes = new Uint8Array(existing);

  return bytes.length === requested.length && bytes.every((byte, index) => byte === requested[index]);
};

/**
 * 구독(또는 이미 있는 구독 재사용). 반드시 사용자 제스처 체인 안에서 호출한다.
 * 기존 구독이 **다른 VAPID 키**로 만들어졌으면(키 회전) 푸시 서비스가 403 을 내므로 지우고 새로 만든다.
 */
export const subscribePush = async (registration: ServiceWorkerRegistration, publicKey: string) => {
  const applicationServerKey = urlBase64ToUint8Array(publicKey);
  const existing = await registration.pushManager.getSubscription();

  if (existing && isSameKey(existing.options.applicationServerKey, applicationServerKey)) {
    return serializeSubscription(existing);
  }

  if (existing) {
    await existing.unsubscribe();
  }

  const subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });

  return serializeSubscription(subscription);
};

/** 브라우저 구독 해지. 서버 쪽 삭제는 호출부가 endpoint 로 따로 한다. */
export const unsubscribePush = async (registration: ServiceWorkerRegistration) => {
  const subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    return null;
  }

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  return endpoint;
};
