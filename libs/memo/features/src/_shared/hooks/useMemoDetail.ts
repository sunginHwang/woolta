// 이 모듈은 '메모 상세' 쿼리 도메인 전체(조회 · 캐시 조작 · 서버 프리페치)를 소유한다.
// prefetchMemoDetail 을 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
// 훅들은 클라이언트 컴포넌트에서만 호출한다 — 경계는 호출부(MemoEditor 등)가 이미 선언한다.

import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { type MemoPartsFragment, type MemoQuery, useMemoQuery, useSuspenseMemoQuery } from '../api/gql.generated';
import type { Memo } from '../types';
import { toMemoContent } from '../utils/memoContent';

/**
 * 메모 상세(본문 포함)를 조회한다. 서버에 없는 메모면 null.
 * 목록 쿼리는 본문을 내려주지 않으므로 본문이 필요한 화면은 이 훅을 쓴다.
 *
 * suspense 쿼리는 끌 수 없으므로(enabled 없음) 호출부가 id 가 있을 때만 마운트해야 한다.
 */
export const useMemoDetail = (memoId: string): Memo | null => {
  const { data } = useSuspenseMemoQuery({ id: memoId });

  const fetchedMemo = data.memo;
  return fetchedMemo ? { ...fetchedMemo, content: toMemoContent(fetchedMemo.content) } : null;
};

/**
 * 메모 상세 캐시 조작.
 * 조회 훅과 같은 캐시를 다루지만 쿼리를 구독하지는 않으므로 훅을 분리했다.
 */
export const useMemoDetailCache = () => {
  const queryClient = useQueryClient();

  const setMemoDetail = useCallback(
    (memo: MemoPartsFragment) => {
      queryClient.setQueryData<MemoQuery>(useMemoQuery.getKey({ id: memo.id }), { memo });
    },
    [queryClient],
  );

  const removeMemoDetail = useCallback(
    (memoId: string) => {
      queryClient.removeQueries({ queryKey: useMemoQuery.getKey({ id: memoId }) });
    },
    [queryClient],
  );

  return { setMemoDetail, removeMemoDetail };
};

/**
 * RSC 프리페치 — codegen 의 `.fetcher` 로 서버에서 상세 캐시를 채운다.
 * useMemoDetail 과 같은 queryKey 를 쓰므로 하이드레이션 직후 Suspense 가 바로 풀린다.
 */
export async function prefetchMemoDetail(queryClient: QueryClient, id: string, options: PrefetchOptions = {}) {
  await queryClient.prefetchQuery({
    queryKey: useMemoQuery.getKey({ id }),
    queryFn: useMemoQuery.fetcher({ id }, toPrefetchHeaders(options)),
  });
}
