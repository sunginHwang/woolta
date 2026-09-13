// 버킷리스트 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.

import { isUnauthenticatedError, type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { BucketListPartsFragment, BucketListSummaryPartsFragment } from '../api/gql.generated';
import { useBucketListQuery, useBucketListSummaryListQuery } from '../api/gql.generated';

export type BucketListSummary = BucketListSummaryPartsFragment;
export type BucketListDetail = BucketListPartsFragment;

export const bucketListSummaryKey = () => useBucketListSummaryListQuery.getKey({});
export const bucketListDetailKey = (id: string) => useBucketListQuery.getKey({ id });

/**
 * 레거시는 모든 실패를 `[]` 로 삼켜 **세션이 끊겨도 "버킷 없음"으로 보였다.**
 * 인증 오류만 그대로 올려 화면이 재로그인을 유도할 수 있게 하고,
 * 그 외 실패(일시적 네트워크 등)는 빈 목록으로 떨어뜨려 기존 동작을 지킨다.
 */
export const fetchBucketListSummary = async (options: PrefetchOptions = {}) => {
  try {
    const data = await useBucketListSummaryListQuery.fetcher({}, toPrefetchHeaders(options))();

    return data.bucketListSummaryList.itemList;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      throw error;
    }

    return [];
  }
};

export const fetchBucketListDetail = async (id: string, options: PrefetchOptions = {}) => {
  const data = await useBucketListQuery.fetcher({ id }, toPrefetchHeaders(options))();

  return data.bucketList ?? null;
};

export function prefetchBucketListSummary(client: QueryClient, options: PrefetchOptions = {}) {
  return client.prefetchQuery({
    queryKey: bucketListSummaryKey(),
    queryFn: () => fetchBucketListSummary(options),
  });
}
