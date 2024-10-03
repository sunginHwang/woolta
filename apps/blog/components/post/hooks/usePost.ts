
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../..//utils/api';
import { IPost } from '../../../types/post/IPost';

const POST_QUERY_KEY = 'getPost';

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

export function getPostQueryKey(categoryNo: string, postNo: string) {
  return [POST_QUERY_KEY, categoryNo, postNo];
}

export const prefetchPost = (
  queryClient: QueryClient,
  { categoryNo, postNo }: { categoryNo: string; postNo: string },
) => {
  return queryClient.prefetchQuery({
    queryKey: getPostQueryKey(categoryNo, postNo),
    queryFn: () => fetchPost(categoryNo, postNo),
  });
};
