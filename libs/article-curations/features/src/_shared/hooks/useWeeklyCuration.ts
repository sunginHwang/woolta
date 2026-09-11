// 이 모듈은 '주간 큐레이션' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchCurationList 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useSuspenseWeeklyCurationListQuery, useWeeklyCurationListQuery } from '../api/gql.generated';
import { WEEKLY_CURATION_LIMIT } from '../constants';
import { getWeekKey } from '../utils/getWeekKey';

/** 이번 주 큐레이션 상태(주차 키/선정 목록/정원 여부)를 반환한다. */
export const useWeeklyCuration = () => {
  const { data } = useSuspenseWeeklyCurationListQuery();

  return useMemo(() => {
    const weekKey = getWeekKey(new Date());
    const curatedArticleIds =
      data.weeklyCurationList.itemList.find((curation) => curation.weekKey === weekKey)?.articleIds ?? [];

    return {
      weekKey,
      curatedArticleIds,
      isFull: curatedArticleIds.length >= WEEKLY_CURATION_LIMIT,
    };
  }, [data]);
};

/** 큐레이션 목록 캐시 조작. */
export const useCurationListCache = () => {
  const queryClient = useQueryClient();

  const invalidateCurationList = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useWeeklyCurationListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateCurationList };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 큐레이션 캐시를 채운다. */
export async function prefetchCurationList(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useWeeklyCurationListQuery.getKey(),
    queryFn: useWeeklyCurationListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
