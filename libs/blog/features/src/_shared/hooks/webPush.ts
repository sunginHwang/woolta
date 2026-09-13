import { useSubscribeWebPushMutation, useUnsubscribeWebPushMutation } from '../api/gql.generated';

/**
 * 웹 푸시 구독/해지.
 *
 * 서비스워커 콜백에서 호출되므로 React 훅이 아니라 생성된 fetcher 를 직접 쓴다.
 * 푸시 등록 실패가 화면을 막으면 안 되므로 여기서 삼키고 로그만 남긴다 —
 * 구독은 다음 방문에 다시 시도된다.
 */
interface SubscribeParams {
  key: string;
  auth: string;
  endPoint: string;
}

export const subscribeWebPush = async (params: SubscribeParams) => {
  try {
    await useSubscribeWebPushMutation.fetcher({ input: params })();
  } catch (error) {
    console.error('[web-push] subscribe failed', error);
  }
};

export const unsubscribeWebPush = async (key: string) => {
  try {
    await useUnsubscribeWebPushMutation.fetcher({ input: { key } })();
  } catch (error) {
    console.error('[web-push] unsubscribe failed', error);
  }
};
