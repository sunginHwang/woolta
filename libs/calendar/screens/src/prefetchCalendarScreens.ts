import {
  getCalendarRange,
  prefetchCalendarEvents,
  prefetchCalendarShares,
  prefetchPendingCalendarShares,
} from '@calendar/features';
import type { PrefetchOptions } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';

/**
 * 캘린더 화면이 쓰는 조회를 한 번에 프리페치한다.
 *
 * 세 도메인 각자의 프리페치를 조합한 것뿐이다 — 개별 queryKey 는 여전히 각 도메인 모듈만 안다.
 *
 * 일정은 '기본 뷰(월) × 오늘' 범위만 채운다. 클라이언트의 기준 날짜는 브라우저 시간대로
 * 마운트 후에 정해지므로 서버가 고른 범위와 어긋날 수 있고, 그 경우 캐시가 비어
 * 클라이언트가 한 번 더 조회한다(화면은 Suspense fallback 을 잠깐 보여준다).
 * 시간대가 같은 대부분의 경우엔 그대로 맞아 첫 렌더에 일정이 들어 있다.
 */
export async function prefetchCalendarScreens(queryClient: QueryClient, nowIso: string, options: PrefetchOptions = {}) {
  await Promise.all([
    prefetchCalendarEvents(queryClient, getCalendarRange('month', nowIso), options),
    prefetchCalendarShares(queryClient, options),
    prefetchPendingCalendarShares(queryClient, options),
  ]);
}
