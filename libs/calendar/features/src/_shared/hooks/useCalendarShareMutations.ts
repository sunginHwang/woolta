'use client';

import {
  useCancelCalendarShareMutation,
  useRequestCalendarShareMutation,
  useRespondCalendarShareMutation,
} from '../api/gql.generated';
import type { RequestCalendarShareResultCode } from '../types';
import { useCalendarEventsCache } from './useCalendarEvents';
import { useCalendarSharesCache } from './useCalendarShares';
import { usePendingCalendarSharesCache } from './usePendingCalendarShares';

/** 초대 결과 코드별 안내 문구 — 서버는 코드만 주고 표현은 클라이언트가 정한다. */
export const REQUEST_SHARE_MESSAGE: Record<RequestCalendarShareResultCode, string> = {
  REQUESTED: '초대를 보냈어요. 상대가 수락하면 서로의 일정이 보여요.',
  ACCEPTED_MUTUAL: '상대도 이미 초대를 보내둬서 바로 공유됐어요.',
  ALREADY_SHARED: '이미 공유 중인 상대예요.',
  ALREADY_PENDING: '이미 보낸 초대가 응답을 기다리고 있어요.',
  USER_NOT_FOUND: '가입되지 않은 이메일이에요.',
  SELF: '자기 자신은 초대할 수 없어요.',
};

/** 공유가 성사돼 열람 권한이 바뀐 코드들 — 일정 목록까지 다시 받아야 한다. */
const VISIBILITY_CHANGED_CODES: RequestCalendarShareResultCode[] = ['ACCEPTED_MUTUAL'];

/** 이메일로 공유를 초대한다. 실패 사유는 에러가 아니라 결과 코드로 온다. */
export const useRequestCalendarShare = () => {
  const { invalidateCalendarShares } = useCalendarSharesCache();
  const { invalidatePendingCalendarShares } = usePendingCalendarSharesCache();
  const { invalidateCalendarEvents } = useCalendarEventsCache();

  const { mutateAsync, isPending } = useRequestCalendarShareMutation({
    onSuccess: ({ requestCalendarShare }) => {
      invalidateCalendarShares();
      // 역방향 초대를 수락한 경우가 있어 받은 대기 목록도 흔들린다
      invalidatePendingCalendarShares();

      if (VISIBILITY_CHANGED_CODES.includes(requestCalendarShare.code)) {
        invalidateCalendarEvents();
      }
    },
  });

  return {
    requestShare: async (email: string) => {
      const { requestCalendarShare } = await mutateAsync({ input: { email } });
      return requestCalendarShare;
    },
    isRequesting: isPending,
  };
};

/**
 * 받은 초대를 수락/거절한다.
 * 수락하면 상대 일정이 보이기 시작하므로 일정 목록까지 무효화한다.
 */
export const useRespondCalendarShare = () => {
  const { invalidateCalendarShares } = useCalendarSharesCache();
  const { invalidatePendingCalendarShares } = usePendingCalendarSharesCache();
  const { invalidateCalendarEvents } = useCalendarEventsCache();

  const { mutateAsync, isPending } = useRespondCalendarShareMutation({
    onSuccess: (_data, { input }) => {
      invalidatePendingCalendarShares();
      invalidateCalendarShares();

      if (input.isAccepted) {
        invalidateCalendarEvents();
      }
    },
  });

  return {
    respondShare: (id: number, isAccepted: boolean) => mutateAsync({ input: { id, isAccepted } }),
    isResponding: isPending,
  };
};

/**
 * 공유 취소/해제.
 * 대기 중 초대는 보낸 사람이, 수락된 공유는 양쪽 누구나 끊을 수 있다.
 * 해제하면 상대 일정이 더 이상 보이지 않으므로 일정 목록도 무효화한다.
 */
export const useCancelCalendarShare = () => {
  const { invalidateCalendarShares } = useCalendarSharesCache();
  const { invalidateCalendarEvents } = useCalendarEventsCache();

  const { mutateAsync, isPending } = useCancelCalendarShareMutation({
    onSuccess: () => {
      invalidateCalendarShares();
      invalidateCalendarEvents();
    },
  });

  return {
    cancelShare: (id: number) => mutateAsync({ input: { id } }),
    isCancelling: isPending,
  };
};
