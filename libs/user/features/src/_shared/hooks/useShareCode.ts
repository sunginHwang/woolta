// 이 모듈은 '공유코드' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchShareCode 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useGetShareCodeQuery, useSuspenseGetShareCodeQuery } from '../api/gql.generated';

/** 내 공유코드를 반환한다. 없으면 서버가 빈 문자열을 준다. */
export const useShareCode = (): string => {
  const { data } = useSuspenseGetShareCodeQuery();

  return data.getShareCode;
};

/**
 * Suspense 경계 밖에서 쓰는 변형 — 코드가 없거나 조회에 실패하면 빈 문자열이다.
 * '코드 없음'은 정상 상태이므로 재시도하지 않는다.
 */
export const useShareCodeOptional = () => {
  const { data, refetch, isLoading } = useGetShareCodeQuery(undefined, { retry: false });

  return { shareCode: data?.getShareCode ?? '', refetch, isLoading };
};

/** 공유코드 캐시 조작. */
export const useShareCodeCache = () => {
  const queryClient = useQueryClient();

  const invalidateShareCode = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useGetShareCodeQuery.getKey() }),
    [queryClient],
  );

  return { invalidateShareCode };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 공유코드 캐시를 채운다. */
export async function prefetchShareCode(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useGetShareCodeQuery.getKey(),
    queryFn: useGetShareCodeQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
