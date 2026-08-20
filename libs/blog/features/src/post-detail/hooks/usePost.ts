'use client';

import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../_shared/api';
import { getPostQueryKey } from '../../_shared/query-keys';
import { IPost } from '../../_shared/types/IPost';

export async function fetchPost(categoryNo: string, postNo: string) {
  try {
    const { data } = await getData<IPost>(`/post/categories/${Number(categoryNo)}/posts/${Number(postNo)}`);
    return data;
  } catch {
    return null;
  }
}

export const usePost = (categoryNo: string, postNo: string) => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: getPostQueryKey(categoryNo, postNo),
    queryFn: () => fetchPost(categoryNo, postNo),
  });

  return {
    post: data,
    ...rest,
  };
};

export const prefetchPost = (
  queryClient: QueryClient,
  { categoryNo, postNo }: { categoryNo: string; postNo: string },
) => {
  return queryClient.prefetchQuery({
    queryKey: getPostQueryKey(categoryNo, postNo),
    queryFn: () => fetchPost(categoryNo, postNo),
  });
};
