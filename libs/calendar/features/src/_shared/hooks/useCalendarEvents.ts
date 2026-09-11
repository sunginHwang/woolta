// 이 모듈은 '일정 목록' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchCalendarEvents 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useCalendarEventListQuery, useSuspenseCalendarEventListQuery } from '../api/gql.generated';
import type { CalendarEvent } from '../types';
import type { CalendarRange } from '../utils/calendarRange';

/**
 * 기간과 겹치는 일정 — 내 일정 + 공유 수락된 상대의 일정.
 *
 * 범위별로 캐시 엔트리가 갈리므로(queryKey 에 range 포함) 뷰를 옮기면 그 기간만 새로 받는다.
 * suspense 쿼리라 로딩은 상위 <Suspense>, 실패는 상위 error.tsx 가 받는다.
 */
export const useCalendarEvents = (range: CalendarRange): CalendarEvent[] => {
  const { data } = useSuspenseCalendarEventListQuery({ input: range });

  return data.calendarEventList.itemList;
};

/**
 * 일정 목록 캐시 조작.
 *
 * 무효화는 범위를 지정하지 않는다 — 일정을 하나 고치면 그게 걸친 기간이 어디까지인지
 * 클라이언트가 알 수 없고, 옆 뷰의 캐시가 낡은 채로 남으면 이동했을 때 틀린 화면이 보인다.
 * prefix('CalendarEventList')만 맞추면 react-query 가 캐시된 모든 범위를 함께 무효화한다.
 */
export const useCalendarEventsCache = () => {
  const queryClient = useQueryClient();

  const invalidateCalendarEvents = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ['CalendarEventList'] }),
    [queryClient],
  );

  return { invalidateCalendarEvents };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 목록 캐시를 채운다. */
export async function prefetchCalendarEvents(
  queryClient: QueryClient,
  range: CalendarRange,
  options: PrefetchOptions = {},
) {
  await queryClient.prefetchQuery({
    queryKey: useCalendarEventListQuery.getKey({ input: range }),
    queryFn: useCalendarEventListQuery.fetcher({ input: range }, toPrefetchHeaders(options)),
  });
}
