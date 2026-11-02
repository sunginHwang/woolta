import {
  getPushSupport,
  isStandaloneDisplay,
  subscribePush,
  urlBase64ToUint8Array,
  waitForServiceWorkerReady,
} from './webPush';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
const CHROME_UA = 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/130.0 Mobile Safari/537.36';

const setUserAgent = (userAgent: string) => {
  Object.defineProperty(navigator, 'userAgent', { value: userAgent, configurable: true });
};

const setMatchMedia = (matchingQueries: string[]) => {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string) => ({ matches: matchingQueries.includes(query), media: query }),
  });
};

const setPushApi = (enabled: boolean) => {
  const define = (target: object, key: string) =>
    Object.defineProperty(target, key, { value: enabled ? {} : undefined, configurable: true });

  define(navigator, 'serviceWorker');
  define(window, 'PushManager');
  define(window, 'Notification');

  if (!enabled) {
    // `'PushManager' in window` 가 거짓이 되도록 키 자체를 지운다
    delete (window as unknown as Record<string, unknown>).PushManager;
    delete (window as unknown as Record<string, unknown>).Notification;
    delete (navigator as unknown as Record<string, unknown>).serviceWorker;
  }
};

describe('urlBase64ToUint8Array 테스트', () => {
  it('base64url 을 패딩 없이도 바이트 배열로 바꾼다.', () => {
    // Given — "hello" 의 base64url
    const encoded = 'aGVsbG8';

    // When
    const bytes = urlBase64ToUint8Array(encoded);

    // Then
    expect(Array.from(bytes)).toEqual([104, 101, 108, 108, 111]);
  });

  it('url-safe 문자(-, _)를 표준 base64 로 되돌려 디코드한다.', () => {
    // Given — 0xfb 0xff → 표준 base64 "+/8=" , url-safe "-_8"
    const encoded = '-_8';

    // When
    const bytes = urlBase64ToUint8Array(encoded);

    // Then
    expect(Array.from(bytes)).toEqual([251, 255]);
  });
});

describe('isStandaloneDisplay 테스트', () => {
  afterEach(() => {
    delete (navigator as unknown as Record<string, unknown>).standalone;
  });

  it('standalone 미디어쿼리가 맞으면 참이다.', () => {
    setMatchMedia(['(display-mode: standalone)']);
    expect(isStandaloneDisplay()).toBe(true);
  });

  it('manifest display 가 fullscreen 이어도 설치된 앱으로 본다.', () => {
    setMatchMedia(['(display-mode: fullscreen)']);
    expect(isStandaloneDisplay()).toBe(true);
  });

  it('미디어쿼리가 모두 거짓이어도 Safari 의 navigator.standalone 이 참이면 참이다.', () => {
    setMatchMedia([]);
    Object.defineProperty(navigator, 'standalone', { value: true, configurable: true });
    expect(isStandaloneDisplay()).toBe(true);
  });

  it('브라우저 탭이면 거짓이다.', () => {
    setMatchMedia([]);
    expect(isStandaloneDisplay()).toBe(false);
  });
});

describe('getPushSupport 테스트', () => {
  afterEach(() => {
    setPushApi(false);
  });

  it('Push API 가 있고 iOS 가 아니면 supported 다.', () => {
    setUserAgent(CHROME_UA);
    setMatchMedia([]);
    setPushApi(true);

    expect(getPushSupport()).toBe('supported');
  });

  it('iOS Safari 탭은 PushManager 가 없어도 "설치 필요" 로 안내한다.', () => {
    setUserAgent(IPHONE_UA);
    setMatchMedia([]);
    setPushApi(false);

    expect(getPushSupport()).toBe('needs-install');
  });

  it('iOS 홈 화면 앱은 supported 다.', () => {
    setUserAgent(IPHONE_UA);
    setMatchMedia(['(display-mode: standalone)']);
    setPushApi(true);

    expect(getPushSupport()).toBe('supported');
  });

  it('iOS 도 아니고 Push API 도 없으면 unsupported 다.', () => {
    setUserAgent(CHROME_UA);
    setMatchMedia([]);
    setPushApi(false);

    expect(getPushSupport()).toBe('unsupported');
  });
});

describe('waitForServiceWorkerReady 테스트', () => {
  afterEach(() => {
    vi.useRealTimers();
    delete (navigator as unknown as Record<string, unknown>).serviceWorker;
  });

  it('ready 가 resolve 되면 등록을 돌려준다.', async () => {
    const registration = { scope: '/' } as ServiceWorkerRegistration;
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve(registration) },
      configurable: true,
    });

    await expect(waitForServiceWorkerReady(1000)).resolves.toBe(registration);
  });

  it('등록 실패로 ready 가 영원히 pending 이면 타임아웃 후 null 을 돌려준다.', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: new Promise(() => undefined) },
      configurable: true,
    });

    const pending = waitForServiceWorkerReady(500);
    await vi.advanceTimersByTimeAsync(500);

    await expect(pending).resolves.toBeNull();
  });
});

describe('subscribePush 테스트', () => {
  // "hello" / "world" 의 base64url — 바이트가 다르면 다른 키다
  const CURRENT_KEY = 'aGVsbG8';
  const OLD_KEY = 'd29ybGQ';

  const makeSubscription = (key: string, endpoint: string) => ({
    endpoint,
    options: { applicationServerKey: urlBase64ToUint8Array(key).buffer },
    unsubscribe: vi.fn(async () => true),
    toJSON: () => ({ endpoint, expirationTime: null, keys: { p256dh: 'p', auth: 'a' } }),
  });

  const makeRegistration = (existing: ReturnType<typeof makeSubscription> | null) => {
    const fresh = makeSubscription(CURRENT_KEY, 'https://push/new');
    const subscribe = vi.fn(async () => fresh);

    return {
      registration: {
        pushManager: { getSubscription: async () => existing, subscribe },
      } as unknown as ServiceWorkerRegistration,
      subscribe,
      fresh,
    };
  };

  it('같은 키로 만든 구독이 있으면 재사용한다.', async () => {
    const existing = makeSubscription(CURRENT_KEY, 'https://push/existing');
    const { registration, subscribe } = makeRegistration(existing);

    const result = await subscribePush(registration, CURRENT_KEY);

    expect(result.endpoint).toBe('https://push/existing');
    expect(subscribe).not.toHaveBeenCalled();
    expect(existing.unsubscribe).not.toHaveBeenCalled();
  });

  it('키가 바뀌었으면 기존 구독을 해지하고 새로 구독한다.', async () => {
    const existing = makeSubscription(OLD_KEY, 'https://push/stale');
    const { registration, subscribe } = makeRegistration(existing);

    const result = await subscribePush(registration, CURRENT_KEY);

    expect(existing.unsubscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(result.endpoint).toBe('https://push/new');
  });

  it('구독이 없으면 새로 구독한다.', async () => {
    const { registration, subscribe } = makeRegistration(null);

    const result = await subscribePush(registration, CURRENT_KEY);

    expect(subscribe).toHaveBeenCalledWith({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CURRENT_KEY),
    });
    expect(result.endpoint).toBe('https://push/new');
  });
});
