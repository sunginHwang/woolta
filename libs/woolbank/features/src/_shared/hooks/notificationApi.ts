'use client';

// 알림함의 쿼리키와 뮤테이션 래퍼를 소유한다.
// 읽음 처리 뒤에는 목록·단건·미읽음 수가 함께 바뀌므로 세 쿼리를 한 번에 무효화한다.
import { useQueryClient } from '@tanstack/react-query';
import type { WoolBankNotificationPartsFragment } from '../api/gql.generated';
import {
  useMarkAllWoolBankNotificationReadMutation,
  useMarkWoolBankNotificationReadMutation,
  useWoolBankNotificationListQuery,
  useWoolBankNotificationQuery,
  useWoolBankUnreadNotificationCountQuery,
} from '../api/gql.generated';

export type Notification = WoolBankNotificationPartsFragment;

/** 목록 기본 건수. 알림은 하루 2~3건이라 50건이면 몇 주치가 들어온다. */
export const NOTIFICATION_LIST_LIMIT = 50;

export const notificationListKeyPrefix = () => useWoolBankNotificationListQuery.getKey();
export const notificationListKey = (limitCount = NOTIFICATION_LIST_LIMIT) =>
  useWoolBankNotificationListQuery.getKey({ limitCount });
export const notificationDetailKey = (id: string) => useWoolBankNotificationQuery.getKey({ id });
/** 단건 쿼리는 변수가 필수라 prefix 는 키의 첫 원소(오퍼레이션 이름)만 잘라 쓴다 */
export const notificationDetailKeyPrefix = () => notificationDetailKey('').slice(0, 1);
export const unreadNotificationCountKey = () => useWoolBankUnreadNotificationCountQuery.getKey();

export const useNotificationListQuery = (limitCount = NOTIFICATION_LIST_LIMIT) =>
  useWoolBankNotificationListQuery({ limitCount }, { queryKey: notificationListKey(limitCount) });

export const useNotificationDetailQuery = (id: string) =>
  useWoolBankNotificationQuery({ id }, { queryKey: notificationDetailKey(id), enabled: id !== '' });

/** 미읽음 수. 푸시가 와도 앱이 열려 있으면 모르므로 마운트마다 다시 센다. */
export const useUnreadNotificationCountQuery = (enabled = true) =>
  useWoolBankUnreadNotificationCountQuery({}, { queryKey: unreadNotificationCountKey(), enabled, staleTime: 0 });

const useInvalidateNotifications = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: notificationListKeyPrefix() }),
      queryClient.invalidateQueries({ queryKey: notificationDetailKeyPrefix() }),
      queryClient.invalidateQueries({ queryKey: unreadNotificationCountKey() }),
    ]);
};

export const useMarkNotificationReadMutation = () => {
  const invalidate = useInvalidateNotifications();

  return useMarkWoolBankNotificationReadMutation({ onSuccess: invalidate });
};

export const useMarkAllNotificationReadMutation = () => {
  const invalidate = useInvalidateNotifications();

  return useMarkAllWoolBankNotificationReadMutation({ onSuccess: invalidate });
};
