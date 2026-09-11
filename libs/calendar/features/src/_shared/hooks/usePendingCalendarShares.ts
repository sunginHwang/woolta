// 이 모듈은 '받은 대기 초대' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchPendingCalendarShares 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { usePendingCalendarShareListQuery } from '../api/gql.generated';
import type { CalendarShare } from '../types';

interface UsePendingCalendarSharesResult {
  /** 내가 받은 대기 중 초대 */
  pendingShares: CalendarShare[];
  isLoading: boolean;
}

/**
 * 로그인 직후 알림 배지용 — 내가 받은 대기 중 초대.
 *
 * 알림 벨은 캘린더 앱 바깥(전역 레일)에 있어서 Suspense·error 경계를 기대할 수 없다.
 * 그래서 여기만 suspense 쿼리를 쓰지 않는다 — 미인증/실패 시 배지를 숨기면 그만이고,
 * 앱 전체가 에러 화면으로 바뀌면 안 된다. 같은 이유로 재시도도 하지 않는다.
 */
export const usePendingCalendarShares = (): UsePendingCalendarSharesResult => {
  const { data, isLoading } = usePendingCalendarShareListQuery(undefined, { retry: false });

  return { pendingShares: data?.pendingCalendarShareList.itemList ?? [], isLoading };
};

/** 받은 대기 초대 캐시 조작. */
export const usePendingCalendarSharesCache = () => {
  const queryClient = useQueryClient();

  const invalidatePendingCalendarShares = useCallback(
    () => queryClient.invalidateQueries({ queryKey: usePendingCalendarShareListQuery.getKey() }),
    [queryClient],
  );

  return { invalidatePendingCalendarShares };
};

/** RSC 프리페치 — 로그인 직후 첫 화면에서 배지가 바로 뜨도록 서버에서 채운다. */
export async function prefetchPendingCalendarShares(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: usePendingCalendarShareListQuery.getKey(),
    queryFn: usePendingCalendarShareListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
