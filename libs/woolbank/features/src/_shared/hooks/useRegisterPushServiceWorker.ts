'use client';

import { getPushSubscription, registerPushServiceWorker } from '@common';
import { useEffect, useRef } from 'react';
import { useSubscribePushMutation } from './pushApi';
import { useUserInfo } from './useUserInfo';

export const WOOLBANK_VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOOLBANK_VAPID_PUBLIC_KEY ?? '';

const getPermission = (): NotificationPermission =>
  typeof Notification === 'undefined' ? 'default' : Notification.permission;

/**
 * 푸시 서비스워커를 등록만 한다 — 권한 요청은 절대 하지 않는다(설정 토글에서 제스처와 함께).
 * 공개키는 SW 가 pushsubscriptionchange 재구독에 쓰도록 postMessage 로 한 번 넘긴다.
 *
 * 그리고 로그인 상태에서 권한이 이미 허용돼 있고 브라우저 구독이 남아 있으면 서버에 한 번 더 upsert 한다(멱등).
 * SW 의 재구독이 세션 만료로 서버 저장에 실패했을 때 이 방문이 그 틈을 메운다 — 제스처가 필요 없는 경로다.
 */
export const useRegisterPushServiceWorker = () => {
  const { userInfo, isLoading } = useUserInfo();
  const subscribeMutation = useSubscribePushMutation();
  const hasSynced = useRef(false);
  // 공유코드 세션도 포함 — 서버 userId 가 주인 계정이라 그 기기 구독이 주인 알림을 받는다
  const isLoggedIn = !isLoading && userInfo !== null;

  useEffect(() => {
    let cancelled = false;

    registerPushServiceWorker().then((registration) => {
      if (cancelled || !registration || !WOOLBANK_VAPID_PUBLIC_KEY) {
        return;
      }

      const worker = registration.active ?? registration.waiting ?? registration.installing;
      worker?.postMessage({ type: 'SET_VAPID_KEY', key: WOOLBANK_VAPID_PUBLIC_KEY });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || hasSynced.current || !WOOLBANK_VAPID_PUBLIC_KEY || getPermission() !== 'granted') {
      return;
    }
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    hasSynced.current = true;
    let cancelled = false;

    navigator.serviceWorker.ready
      .then(getPushSubscription)
      .then((subscription) => {
        if (cancelled || !subscription) {
          return;
        }

        const json = subscription.toJSON();

        if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
          return;
        }

        return subscribeMutation.mutateAsync({
          input: {
            endpoint: json.endpoint,
            p256dh: json.keys.p256dh,
            auth: json.keys.auth,
            expirationTime: json.expirationTime == null ? null : new Date(json.expirationTime).toISOString(),
            userAgent: navigator.userAgent,
          },
        });
      })
      .catch((error) => console.warn('[web-push] 구독 재동기화 실패', error));

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, subscribeMutation]);
};
