'use client';
import { useQuery } from '@tanstack/react-query';
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
  const { data, ...rest } = useQuery<BucketList[]>({
    queryKey: [BUCKET_LIST_QUERY_KEY],
    queryFn: fetchBucketList,
  });

  return {
    bucketList: data ?? [],
    ...rest,
  };
};
