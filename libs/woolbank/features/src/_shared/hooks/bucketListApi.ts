// 버킷리스트 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.

import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { BucketListPartsFragment, BucketListSummaryPartsFragment } from '../api/gql.generated';
import { useBucketListQuery, useBucketListSummaryListQuery } from '../api/gql.generated';

export type BucketListSummary = BucketListSummaryPartsFragment;
export type BucketListDetail = BucketListPartsFragment;

export const bucketListSummaryKey = () => useBucketListSummaryListQuery.getKey({});
export const bucketListDetailKey = (id: string) => useBucketListQuery.getKey({ id });

/**
 * 레거시는 실패를 `[]` 로 삼켰다(세션 만료가 "버킷 없음"으로 보인다).
 * 이관 범위를 넓히지 않기 위해 지금은 그 동작을 그대로 옮긴다.
 */
export const fetchBucketListSummary = async (options: PrefetchOptions = {}) => {
  try {
    const data = await useBucketListSummaryListQuery.fetcher({}, toPrefetchHeaders(options))();

    return data.bucketListSummaryList.itemList;
  } catch {
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
