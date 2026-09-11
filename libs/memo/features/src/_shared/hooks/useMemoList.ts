// 이 모듈은 '메모 목록' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchMemoList 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
// 훅들은 클라이언트 컴포넌트에서만 호출한다 — 경계는 호출부(MemoList 등)가 이미 선언한다.

import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useMemoListQuery, useSuspenseMemoListQuery } from '../api/gql.generated';
import type { MemoSummary } from '../types';

/**
 * 서버의 메모 목록을 최근 수정 순으로 반환한다.
 * 목록에는 본문이 없다 — 본문이 필요하면 useMemoDetail 을 쓴다.
 *
 * suspense 쿼리라 로딩은 상위 <Suspense>, 실패는 상위 error.tsx 가 받는다.
 * 서버에서 prefetchMemoList 로 채워두면 첫 렌더에 바로 데이터가 있다.
 */
export const useMemoList = (): MemoSummary[] => {
  const { data } = useSuspenseMemoListQuery();

  return useMemo(() => [...data.memoList.itemList].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [data]);
};

/**
 * 메모 목록 캐시 조작.
 * 조회 훅과 같은 캐시를 다루지만 쿼리를 구독하지는 않으므로 훅을 분리했다.
 */
export const useMemoListCache = () => {
  const queryClient = useQueryClient();

  const invalidateMemoList = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useMemoListQuery.getKey() }),
    [queryClient],
  );

  return { invalidateMemoList };
};

/**
 * RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 목록 캐시를 채운다.
 * useMemoList 와 같은 queryKey 를 쓰므로 하이드레이션 직후 Suspense 가 바로 풀린다.
 */
export async function prefetchMemoList(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useMemoListQuery.getKey(),
    queryFn: useMemoListQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
