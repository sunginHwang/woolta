// 이 모듈은 '공유 현황' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchCalendarShares 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCalendarShareListQuery, useSuspenseCalendarShareListQuery } from '../api/gql.generated';
import type { CalendarShare } from '../types';

/** 공유 현황 — 수락된 관계 + 내가 보낸 대기 중 초대. */
export const useCalendarShares = (): CalendarShare[] => {
  const { data } = useSuspenseCalendarShareListQuery();

  return data.calendarShareList.itemList;
};

/** 공유 현황 캐시 조작. */
export const useCalendarSharesCache = () => {
  const queryClient = useQueryClient();

  const invalidateCalendarShares = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useCalendarShareListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateCalendarShares };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 공유 현황 캐시를 채운다. */
export async function prefetchCalendarShares(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useCalendarShareListQuery.getKey(),
    queryFn: useCalendarShareListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
