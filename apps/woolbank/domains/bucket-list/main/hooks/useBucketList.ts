'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { type BucketListSummary, bucketListSummaryKey, fetchBucketListSummary } from '@woolta/woolbank-features';

// 조회 함수·쿼리키는 libs 의 api 모듈이 소유한다 — 여기서는 화면이 쓰는 형태로만 감싼다.
export type BucketList = BucketListSummary;

export const useBucketList = () => {
  const queryClient = useQueryClient();
  const { data, ...rest } = useQuery({
    queryKey: bucketListSummaryKey(),
    queryFn: () => fetchBucketListSummary(),
  });

  /**
   * 레거시는 setQueryData 로 목록을 직접 고쳤다(완료 처리는 prev 를 제자리 변경까지 했다).
   * 서버를 정본으로 삼아 무효화한다 — 완료/삭제 모두 목록을 다시 받아오면 된다.
   */
  const invalidate = () => queryClient.invalidateQueries({ queryKey: bucketListSummaryKey() });

  return {
    removeBucketById: invalidate,
    updateBucketState: invalidate,
    bucketList: data ?? [],
    ...rest,
  };
};
