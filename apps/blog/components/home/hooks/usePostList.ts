import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { IPost } from '../../../types/post/IPost';
import { getData } from '../../../utils/api';

export const POSTS_QUERY_KEY = 'getPosts';

export async function fetchPostList(categoryId: string) {
  const urlPath = categoryId === '-1' ? '/post/categories/new/posts' : `/post/categories/${categoryId}/posts`;
  const { data } = await getData<IPost[]>(urlPath);
  return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export const usePostList = (categoryId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [POSTS_QUERY_KEY, categoryId],
    queryFn: () => fetchPostList(categoryId),
  });
  const post_list: IPost[] = data ?? [];

  return {
    post_list,
    ...rest,
  };
};

export function prefetchPostList(client: QueryClient, categoryId: string) {
  return client.prefetchQuery({
    queryKey: [POSTS_QUERY_KEY, categoryId],
    queryFn: () => fetchPostList(categoryId),
  });
}




  

