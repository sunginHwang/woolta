'use client';

import {
  getPushSubscription,
  getPushSupport,
  type PushSupport,
  subscribePush,
  unsubscribePush,
  waitForServiceWorkerReady,
} from '@common';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import type { WoolBankPushStatusQuery } from '../_shared/api/gql.generated';
import {
  type PushSetting,
  pushStatusKeyPrefix,
  usePushStatusQuery,
  useSendTestPushMutation,
  useSubscribePushMutation,
  useUnsubscribePushMutation,
  useUpdatePushSettingMutation,
} from '../_shared/hooks/pushApi';
import { WOOLBANK_VAPID_PUBLIC_KEY } from '../_shared/hooks/useRegisterPushServiceWorker';
import { useToast } from '../_shared/toast/useToast';

export type PushSettingState =
  /** 빌드에 VAPID 공개키가 없다 — 설정 문제라 사용자에게는 보여주지 않는다 */
  | 'unconfigured'
  /** Push API 가 없는 브라우저 */
  | 'unsupported'
  /** iOS — 홈 화면에 추가해야 푸시가 된다 */
  | 'needs-install'
  /** 서비스워커가 준비되지 않았다(등록 실패 등) */
  | 'unavailable'
  /** 권한을 거부한 상태. 브라우저 설정에서만 되돌릴 수 있다 */
  | 'denied'
  | 'off'
  | 'on'
  /** 서비스워커/서버 상태를 아직 모른다 */
  | 'pending';

export interface PushSettingModel {
  state: PushSettingState;
  setting: PushSetting;
  /** 이 유저가 등록한 기기 수 */
  subscriptionCount: number;
  /** 요청 진행 중 — 토글을 잠근다 */
  isBusy: boolean;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  setRegularExpenditure: (value: boolean) => Promise<void>;
  sendTest: () => Promise<void>;
}

const DEFAULT_SETTING: PushSetting = { regularExpenditure: true };

const getPermission = (): NotificationPermission =>
  typeof Notification === 'undefined' ? 'default' : Notification.permission;

/**
 * 푸시 설정 상태 머신.
 *
 * 브라우저 전용 값(Push API 유무, 권한, 구독)은 렌더 중에 읽지 않고 마운트 후 effect 에서 채운다 —
 * 서버 HTML 과 첫 클라이언트 렌더가 모두 'pending' 으로 같아야 hydration 이 깨지지 않는다.
 *
 * 브라우저 구독(endpoint)과 서버 구독이 **둘 다** 있어야 'on' 이다 — 한쪽만 있으면 'off' 로 보여
 * 다시 켜면 enable() 이 기존 브라우저 구독을 재사용해 서버에 upsert 한다.
 *
 * enable() 은 권한 요청을 **가장 먼저, 동기적으로** 호출한다. iOS 는 클릭 제스처 밖의 요청을 무시한다.
 */
export const usePushSetting = (): PushSettingModel => {
  const [support, setSupport] = useState<PushSupport | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [isEndpointResolved, setIsEndpointResolved] = useState(false);
  const [isWorkerUnavailable, setIsWorkerUnavailable] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const isConfigured = WOOLBANK_VAPID_PUBLIC_KEY !== '';
  const isSupported = support === 'supported' && isConfigured;

  const queryClient = useQueryClient();
  const { onToast } = useToast();
  const statusQuery = usePushStatusQuery(endpoint, isSupported && isEndpointResolved);
  const subscribeMutation = useSubscribePushMutation();
  const unsubscribeMutation = useUnsubscribePushMutation();
  const updateSettingMutation = useUpdatePushSettingMutation();
  const sendTestMutation = useSendTestPushMutation();

  useEffect(() => {
    setSupport(getPushSupport());
    setPermission(getPermission());
  }, []);

  // 현재 기기의 브라우저 구독을 읽는다. SW 등록은 레이아웃이 이미 했다.
  useEffect(() => {
    if (!isSupported) {
      return;
    }

    let cancelled = false;

    waitForServiceWorkerReady()
      .then(async (registration) => {
        if (!registration) {
          throw new Error('service worker not ready');
        }

        return getPushSubscription(registration);
      })
      .then((subscription) => {
        if (!cancelled) {
          setEndpoint(subscription?.endpoint ?? null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsWorkerUnavailable(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsEndpointResolved(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSupported]);

  const status = statusQuery.data?.getWoolBankPushStatus;

  const deriveState = (): PushSettingState => {
    if (!isConfigured) {
      return 'unconfigured';
    }
    if (support === null) {
      return 'pending';
    }
    if (support === 'needs-install') {
      return 'needs-install';
    }
    if (support === 'unsupported') {
      return 'unsupported';
    }
    if (isWorkerUnavailable) {
      return 'unavailable';
    }
    if (permission === 'denied') {
      return 'denied';
    }
    if (!isEndpointResolved || (statusQuery.isPending && statusQuery.fetchStatus !== 'idle')) {
      return 'pending';
    }
    return endpoint !== null && status?.isSubscribed ? 'on' : 'off';
  };

  const enable = useCallback(async () => {
    setIsBusy(true);

    try {
      // 제스처 체인의 첫 await 여야 한다
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== 'granted') {
        if (result === 'denied') {
          onToast('알림 권한이 차단되어 있어요. 브라우저 설정에서 허용해주세요.');
        }
        return;
      }

      const registration = await waitForServiceWorkerReady();

      if (!registration) {
        setIsWorkerUnavailable(true);
        return;
      }

      const subscription = await subscribePush(registration, WOOLBANK_VAPID_PUBLIC_KEY);

      await subscribeMutation.mutateAsync({
        input: { ...subscription, userAgent: navigator.userAgent },
      });
      setEndpoint(subscription.endpoint);
      onToast('알림을 켰어요.');
    } catch (error) {
      console.error('[web-push] enable failed', error);
      onToast('알림을 켜지 못했어요. 다시 시도해주세요.');
    } finally {
      setIsBusy(false);
    }
  }, [onToast, subscribeMutation]);

  const disable = useCallback(async () => {
    setIsBusy(true);

    try {
      const registration = await waitForServiceWorkerReady();

      if (!registration) {
        setIsWorkerUnavailable(true);
        return;
      }

      const removedEndpoint = (await unsubscribePush(registration)) ?? endpoint;

      if (removedEndpoint) {
        await unsubscribeMutation.mutateAsync({ input: { endpoint: removedEndpoint } });
      }
      setEndpoint(null);
      onToast('알림을 껐어요.');
    } catch (error) {
      console.error('[web-push] disable failed', error);
      onToast('알림을 끄지 못했어요. 다시 시도해주세요.');
    } finally {
      setIsBusy(false);
    }
  }, [endpoint, onToast, unsubscribeMutation]);

  const setRegularExpenditure = useCallback(
    async (value: boolean) => {
      if (isBusy) {
        return;
      }

      setIsBusy(true);

      // 낙관적 갱신 — 스위치가 즉시 움직이고, 실패하면 이전 값으로 되돌린다
      const statusKey = pushStatusKeyPrefix();
      const previous = queryClient.getQueriesData<WoolBankPushStatusQuery>({ queryKey: statusKey });

      queryClient.setQueriesData<WoolBankPushStatusQuery>({ queryKey: statusKey }, (data) =>
        data
          ? {
              ...data,
              getWoolBankPushStatus: {
                ...data.getWoolBankPushStatus,
                setting: { ...data.getWoolBankPushStatus.setting, regularExpenditure: value },
              },
            }
          : data,
      );

      try {
        await updateSettingMutation.mutateAsync({ input: { regularExpenditure: value } });
      } catch (error) {
        for (const [key, data] of previous) {
          queryClient.setQueryData(key, data);
        }
        console.error('[web-push] update setting failed', error);
        onToast('설정을 저장하지 못했어요.');
      } finally {
        setIsBusy(false);
      }
    },
    [isBusy, onToast, queryClient, updateSettingMutation],
  );

  const sendTest = useCallback(async () => {
    if (isBusy) {
      return;
    }

    setIsBusy(true);

    try {
      // 이 기기로만 보낸다 — 다른 기기에 테스트 알림이 가면 헷갈린다
      const result = await sendTestMutation.mutateAsync({ input: endpoint ? { endpoint } : undefined });

      // 서버에 VAPID 키가 없거나, 구독 기기가 0개거나, 전부 실패하면 false
      onToast(
        result.sendWoolBankTestPush ? '테스트 알림을 보냈어요.' : '보낼 수 있는 기기가 없어요. 알림을 다시 켜주세요.',
      );
    } catch (error) {
      console.error('[web-push] test push failed', error);
      onToast('테스트 알림을 보내지 못했어요.');
    } finally {
      setIsBusy(false);
    }
  }, [endpoint, isBusy, onToast, sendTestMutation]);

  return {
    state: deriveState(),
    setting: status?.setting ?? DEFAULT_SETTING,
    subscriptionCount: status?.subscriptionCount ?? 0,
    isBusy,
    enable,
    disable,
    setRegularExpenditure,
    sendTest,
  };
};
