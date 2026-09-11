// 이 모듈은 '할 일 카테고리' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchCategoryList 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useSuspenseTodoCategoryListQuery, useTodoCategoryListQuery } from '../api/gql.generated';
import type { TodoCategory } from '../types';

/** 카테고리 목록을 정렬 순서대로 반환한다. */
export const useCategoryList = (): TodoCategory[] => {
  const { data } = useSuspenseTodoCategoryListQuery();

  return useMemo(() => [...data.todoCategoryList.itemList].sort((a, b) => a.order - b.order), [data]);
};

/** 카테고리 목록 캐시 조작. */
export const useCategoryListCache = () => {
  const queryClient = useQueryClient();

  const invalidateCategoryList = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useTodoCategoryListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateCategoryList };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 카테고리 캐시를 채운다. */
export async function prefetchCategoryList(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useTodoCategoryListQuery.getKey(),
    queryFn: useTodoCategoryListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
