import type { QueryClient } from '@tanstack/react-query';
import { fetchPost } from '../post-detail/hooks/usePost';
import { fetchPostList } from '../post-list/hooks/usePostList';
import { prefetchCategories } from './hooks/useCategories';
import { getPostQueryKey, POSTS_QUERY_KEY } from './query-keys';

// 조회 함수와 쿼리키는 각 훅 모듈이 소유한다 — 여기서는 조합만 한다.
// blog 읽기는 인증이 필요 없으므로 쿠키를 넘기지 않는다.

export async function prefetchBlogList(queryClient: QueryClient, { category }: { category: string }) {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [POSTS_QUERY_KEY, category],
      queryFn: () => fetchPostList(category),
    }),
    prefetchCategories(queryClient),
  ]);
}

export async function prefetchBlogPost(
  queryClient: QueryClient,
  { categoryNo, postNo }: { categoryNo: string; postNo: string },
) {
  await queryClient.prefetchQuery({
    queryKey: getPostQueryKey(categoryNo, postNo),
    queryFn: () => fetchPost(categoryNo, postNo),
  });
}
