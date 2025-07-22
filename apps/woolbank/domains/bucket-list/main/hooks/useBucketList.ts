'use client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getData } from '../../../../utils/api';

export const BUCKET_LIST_QUERY_KEY = 'getBucketList';

export type AcccountBookType = 'expenditure' | 'income';

export interface BucketList {
  id: number;
  title: string;
  completeDate: Date;
  todoCount: number;
  isComplete: boolean;
  completeTodoCount: number;
  thumbImageUrl?: string;
  updatedAt: Date;
}

/*
 * 버킷리스트 조회
 * */
export const fetchBucketList = async () => {
  try {
    const { data } = await getData<BucketList[]>('bucket-list');

    return data.map((item) => {
      return {
        ...item,
        completeDate: new Date(item.completeDate),
      };
    });
  } catch {
    return [];
  }
};

export const useBucketList = () => {
  const queryClient = useQueryClient();
  const { data, ...rest } = useQuery<BucketList[]>({
    queryKey: [BUCKET_LIST_QUERY_KEY],
    queryFn: fetchBucketList,
  });

  const removeBucketById = (bucketId: number) => {
    queryClient.setQueryData<BucketList[]>([BUCKET_LIST_QUERY_KEY], (prev = []) => {
      return prev.filter((bucket) => bucket.id !== bucketId);
    });
  };

  const updateBucketState = (bucketId: number) => {
    queryClient.setQueryData<BucketList[]>([BUCKET_LIST_QUERY_KEY], (prev = []) => {
      return prev.map((bucket) => {
        if (bucket.id === bucketId) {
          bucket.isComplete = true;
        }
        return bucket;
      });
    });
  };

  return {
    removeBucketById,
    updateBucketState,
    bucketList: data ?? [],
    ...rest,
  };
};
