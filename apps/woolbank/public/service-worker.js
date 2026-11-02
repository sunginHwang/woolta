/**
 * 뱅킷리스트 푸시 서비스워커.
 *
 * 역할은 셋뿐이다 — 푸시를 알림으로 띄우고, 클릭하면 앱을 열고, 브라우저가 구독을 갈아끼우면 재구독한다.
 * 오프라인 캐시는 하지 않는다(범위 밖).
 *
 * 페이로드는 Declarative Web Push 포맷(Safari 18.4+ 가 SW 없이 직접 띄우는 형태)을 기본으로 받는다.
 *   { "web_push": 8030, "notification": { "title", "body", "navigate", "tag" } }
 * 그 외 브라우저(Chrome/Firefox/iOS 16.4~18.3)는 이 핸들러가 같은 JSON 을 읽어 띄운다.
 */
const DEFAULT_URL = '/';
const ICON = '/android-chrome-192x192.png';
const BADGE = '/badge-96x96.png';
const GRAPHQL_URL = '/api/gql/woolBank/graphql';
const LOG = '[woolbank-sw]';
const DEFAULT_TITLE = '뱅킷리스트';
const DEFAULT_BODY = '새 알림이 도착했어요.';

/**
 * 페이지가 postMessage 로 넘겨주는 VAPID 공개키 — 재구독(pushsubscriptionchange) 폴백용.
 * pushsubscriptionchange 는 며칠 뒤 새로 깨어난 SW 에서 오므로 모듈 변수로는 남지 않는다 → Cache API 에 둔다.
 */
const KEY_CACHE = 'woolbank-push';
const KEY_CACHE_PATH = '/__vapid-public-key';

const saveVapidPublicKey = (key) =>
  caches.open(KEY_CACHE).then((cache) => cache.put(KEY_CACHE_PATH, new Response(key)));

const loadVapidPublicKey = () =>
  caches
    .open(KEY_CACHE)
    .then((cache) => cache.match(KEY_CACHE_PATH))
    .then((response) => (response ? response.text() : null))
    .catch(() => null);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SET_VAPID_KEY' && typeof event.data.key === 'string') {
    event.waitUntil(saveVapidPublicKey(event.data.key));
  }
});

/** 선언형 포맷과 평면 포맷({title, body, url}) 둘 다 같은 모양으로 정규화한다 */
const parsePayload = (event) => {
  if (!event.data) {
    return null;
  }

  let json;
  try {
    json = event.data.json();
  } catch {
    return { title: '뱅킷리스트', body: event.data.text(), url: DEFAULT_URL, tag: undefined };
  }

  const notification = json && json.web_push === 8030 && json.notification ? json.notification : json;

  if (!notification?.title) {
    return null;
  }

  return {
    title: notification.title,
    body: notification.body || '',
    url: notification.navigate || notification.url || DEFAULT_URL,
    tag: notification.tag,
  };
};

self.addEventListener('push', (event) => {
  // userVisibleOnly 약속 — 알림 없이 끝내면 Chrome 이 "백그라운드에서 업데이트됨" 을 띄우고 이후 제한한다.
  // 그래서 페이로드를 못 읽어도 기본 알림이라도 띄운다.
  const payload = parsePayload(event) || { title: DEFAULT_TITLE, body: DEFAULT_BODY, url: DEFAULT_URL, tag: undefined };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: ICON,
      badge: BADGE,
      tag: payload.tag,
      renotify: Boolean(payload.tag),
      data: { url: payload.url },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = new URL(event.notification.data?.url || DEFAULT_URL, self.location.origin).href;

  // 열린 창이 있으면 새 창 대신 그 창을 앞으로 가져와 이동한다
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const sameOrigin = clientList.find((client) => new URL(client.url).origin === self.location.origin);

      if (!sameOrigin) {
        return self.clients.openWindow(url);
      }

      // includeUncontrolled 로 잡힌 창은 이 SW 가 제어하지 않을 수 있어 navigate 가 거부된다 → 새 창으로 폴백
      return sameOrigin
        .focus()
        .then((focused) => (focused && 'navigate' in focused ? focused.navigate(url) : Promise.reject()))
        .catch(() => self.clients.openWindow(url));
    }),
  );
});

/**
 * 브라우저가 구독 엔드포인트를 갈아끼울 때. 이걸 안 받으면 서버의 구독은 조용히 죽고 410 으로 돌아온다.
 * 같은 공개키로 재구독해 서버에 upsert 한다(endpoint 기준이라 같은 뮤테이션을 쓴다).
 * 쿠키는 same-origin 요청이라 자동으로 붙는다. 세션이 끊겨 실패하면 여기서는 로그만 남기고,
 * 다음 방문 때 useRegisterPushServiceWorker 가 브라우저 구독을 서버에 다시 upsert 한다.
 */
self.addEventListener('pushsubscriptionchange', (event) => {
  const oldKey = event.oldSubscription?.options?.applicationServerKey;

  event.waitUntil(
    Promise.resolve(oldKey || loadVapidPublicKey())
      .then((applicationServerKey) => {
        if (!applicationServerKey) {
          throw new Error('재구독할 공개키가 없다');
        }

        return self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey });
      })
      .then((subscription) => {
        const json = subscription.toJSON();

        return fetch(GRAPHQL_URL, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query:
              'mutation SubscribeWoolBankPush($input: SubscribeWoolBankPushInput!) { subscribeWoolBankPush(input: $input) }',
            variables: {
              input: {
                endpoint: json.endpoint,
                p256dh: json.keys.p256dh,
                auth: json.keys.auth,
                expirationTime: json.expirationTime == null ? null : new Date(json.expirationTime).toISOString(),
                userAgent: self.navigator.userAgent,
              },
            },
          }),
        });
      })
      .then(async (response) => {
        // GraphQL 은 UNAUTHENTICATED 같은 실패도 200 으로 주므로 errors 까지 본다
        const json = await response.json().catch(() => null);

        if (!response.ok || json?.errors?.length > 0) {
          console.warn(`${LOG} 재구독 서버 저장 실패`, response.status, json?.errors);
        }
      })
      .catch((error) => console.error(`${LOG} 재구독 실패`, error)),
  );
});
