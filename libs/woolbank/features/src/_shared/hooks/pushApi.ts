'use client';

// Web Push 구독·설정의 쿼리키와 뮤테이션 래퍼를 소유한다.
// 구독은 기기(endpoint) 단위, 설정은 유저 단위라 상태 쿼리는 endpoint 를 변수로 받는다.
import { useQueryClient } from '@tanstack/react-query';
import type { WoolBankPushSettingPartsFragment, WoolBankPushStatusQuery } from '../api/gql.generated';
import {
  useSendWoolBankTestPushMutation,
  useSubscribeWoolBankPushMutation,
  useUnsubscribeWoolBankPushMutation,
  useUpdateWoolBankPushSettingMutation,
  useWoolBankPushStatusQuery,
} from '../api/gql.generated';

export type PushSetting = WoolBankPushSettingPartsFragment;
export type PushStatus = WoolBankPushStatusQuery['getWoolBankPushStatus'];

/** endpoint 와 무관하게 이 유저의 모든 상태 쿼리를 무효화하려고 prefix 만 쓴다 */
export const pushStatusKeyPrefix = () => useWoolBankPushStatusQuery.getKey();
export const pushStatusKey = (endpoint: string | null) =>
  useWoolBankPushStatusQuery.getKey({ endpoint: endpoint ?? undefined });

export const usePushStatusQuery = (endpoint: string | null, enabled = true) =>
  useWoolBankPushStatusQuery(
    { endpoint: endpoint ?? undefined },
    { queryKey: pushStatusKey(endpoint), enabled, staleTime: 0 },
  );

const useInvalidatePushStatus = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: pushStatusKeyPrefix() });
};

export const useSubscribePushMutation = () => {
  const invalidate = useInvalidatePushStatus();

  return useSubscribeWoolBankPushMutation({ onSuccess: invalidate });
};

export const useUnsubscribePushMutation = () => {
  const invalidate = useInvalidatePushStatus();

  return useUnsubscribeWoolBankPushMutation({ onSuccess: invalidate });
};

export const useUpdatePushSettingMutation = () => {
  const invalidate = useInvalidatePushStatus();

  return useUpdateWoolBankPushSettingMutation({ onSuccess: invalidate });
};

export const useSendTestPushMutation = () => useSendWoolBankTestPushMutation();
