// 이 모듈은 '로그인 사용자' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchMe 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useMeQuery, useSuspenseMeQuery } from '../api/gql.generated';
import type { UserInfo } from '../types';

/**
 * 로그인한 사용자를 반환한다. 인증 영역(로그인 게이트 안쪽)에서 쓴다.
 *
 * 서버 `me` 는 non-null 이라 미인증이면 UNAUTHENTICATED 를 던진다.
 * 즉 이 훅은 Suspense 경계 + error.tsx 가 있는 화면에서만 안전하다.
 * 로그인 여부 자체를 판별해야 하면 useMeOptional 을 쓴다.
 */
export const useMe = (): UserInfo => {
  const { data } = useSuspenseMeQuery();

  return data.me;
};

/**
 * 로그인 여부를 판별해야 하는 화면용 — 미인증이면 undefined 를 반환한다.
 * 미인증은 정상 상태이므로 재시도하지 않는다.
 */
export const useMeOptional = (): { user: UserInfo | undefined; isLoading: boolean } => {
  const { data, isLoading } = useMeQuery(undefined, { retry: false });

  return { user: data?.me, isLoading };
};

/** 로그인 사용자 캐시 조작. */
export const useMeCache = () => {
  const queryClient = useQueryClient();

  const invalidateMe = useCallback(
    () => queryClient.invalidateQueries({ queryKey: useMeQuery.getKey() }),
    [queryClient],
  );

  /**
   * 로그아웃 · 계정 전환 시 사용한다.
   * 세션이 바뀌면 캐시에 남은 모든 사용자별 데이터가 다른 사람의 것이 되므로 통째로 비운다.
   */
  const clearSessionCache = useCallback(() => queryClient.clear(), [queryClient]);

  return { invalidateMe, clearSessionCache };
};

/** RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 사용자 캐시를 채운다. */
export async function prefetchMe(queryClient: QueryClient, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useMeQuery.getKey(),
    queryFn: useMeQuery.fetcher(undefined, toPrefetchHeaders(options)),
  });
}
