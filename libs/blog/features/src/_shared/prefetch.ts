import type { QueryClient } from '@tanstack/react-query';
import { getData } from './api';
import { CATEGORIES_QUERY_KEY, getPostQueryKey, POSTS_QUERY_KEY } from './query-keys';
import type { ICategory } from './types/ICategory';
import type { IPost } from './types/IPost';

async function fetchPostListForPrefetch(categoryId: string) {
  const urlPath = categoryId === '-1' ? '/post/categories/new/posts' : `/post/categories/${categoryId}/posts`;
  const { data } = await getData<IPost[]>(urlPath);
  return data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

async function fetchCategoriesForPrefetch() {
  const { data } = await getData<ICategory[]>('/post/categories');
  return data;
}

async function fetchPostForPrefetch(categoryNo: string, postNo: string) {
  try {
    const { data } = await getData<IPost>(`/post/categories/${Number(categoryNo)}/posts/${Number(postNo)}`);
    return data;
  } catch {
    return null;
  }
}

export async function prefetchBlogList(queryClient: QueryClient, { category }: { category: string }) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [POSTS_QUERY_KEY, category],
      queryFn: () => fetchPostListForPrefetch(category),
    }),
    queryClient.prefetchQuery({
      queryKey: [CATEGORIES_QUERY_KEY],
      queryFn: fetchCategoriesForPrefetch,
    }),
  ]);
}

export async function prefetchBlogPost(
  queryClient: QueryClient,
  { categoryNo, postNo }: { categoryNo: string; postNo: string },
) {
  await queryClient.prefetchQuery({
    queryKey: getPostQueryKey(categoryNo, postNo),
    queryFn: () => fetchPostForPrefetch(categoryNo, postNo),
  });
}
