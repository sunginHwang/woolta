import { subscribeWebPush, unsubscribeWebPush } from '@blog/features';
import type { IPwaSubscription } from '../types/pwa/IPwaSubscription';

const PWA_LOG: string = '[WOOLTA_BLOG_SERVICE_WORKER]';
const PUSH_APPLICATION_SERVER_KEY =
  'BBUmILImgSCb6wcUMIDPKj1B-kxu_x4VtHeQYVkLIRAlFCtTTFblcRsANxQCBfBYR8jOSx4OsvoFjObsyWc5p9Y';
const ACCESS_PUSH_TOKEN = '_WOOLTA_PUSH__';
const PWA_NOTIFICATION_PERMISSIONS = {
  default: 'default',
  granted: 'granted',
  denied: 'denied',
};

const pushSubscription = (subscription: IPwaSubscription) => {
  subscribeWebPush({
    auth: subscription.keys.auth,
    key: subscription.keys.p256dh,
    endPoint: subscription.endpoint,
  });
};

/**
 * 해지는 구독 때 저장해 둔 `keys.auth` 를 넘긴다 — 구독이 `key` 로 보내는 `keys.p256dh` 가 아니다.
 * 서버도 이 값을 auth 컬럼으로 조회해 지운다(WebPushService.removePushSubscription).
 * 이름이 어긋나 보이지만 레거시부터 이어진 동작이라 그대로 둔다.
 */
const pushUnsubscription = (pwaSubscriptionKey: string) => {
  unsubscribeWebPush(pwaSubscriptionKey);
};

export const initSubscribe = async (swRegistration: unknown) => {
  await navigator.serviceWorker.ready; // <--- WAIT
  // 사용자가 브라우저에서 강제로 알람 차단 할 경우 남아있는 키 제거
  if (Notification.permission !== PWA_NOTIFICATION_PERMISSIONS.granted) {
    removeAccessPushToken();
  }

  if (Notification.permission === PWA_NOTIFICATION_PERMISSIONS.default) {
    subscribeUser(swRegistration);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subscribeUser = (swRegistration: any) => {
  console.log(`${PWA_LOG} subscribe`);
  const applicationServerKey = urlB64ToUint8Array(PUSH_APPLICATION_SERVER_KEY);

  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((subscription: any) => {
      const pwaSubscription = JSON.parse(JSON.stringify(subscription));
      localStorage.setItem(ACCESS_PUSH_TOKEN, pwaSubscription.keys.auth);
      pushSubscription(pwaSubscription);
    })
    .catch(() => console.log(`${PWA_LOG} subscribe error`));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unSubscribeUser = (swRegistration: any) => {
  console.log(`${PWA_LOG} unsubscribe`);

  swRegistration.pushManager
    .getSubscription()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((subscription: any) => {
      if (subscription) {
        return subscription.unsubscribe();
      }
    })
    .catch(() => console.log(`${PWA_LOG} unsubscribe error: `))
    .then(() => removeAccessPushToken());
};

const urlB64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const removeAccessPushToken = () => {
  console.log(`${PWA_LOG} removeAccessPushToken`);
  const pwaSubscriptionKey = localStorage.getItem(ACCESS_PUSH_TOKEN);
  if (!pwaSubscriptionKey) {
    return;
  }
  console.log(`${PWA_LOG} removeAccessPushToken key`, pwaSubscriptionKey);
  pushUnsubscription(pwaSubscriptionKey);
  localStorage.removeItem(ACCESS_PUSH_TOKEN);
};
