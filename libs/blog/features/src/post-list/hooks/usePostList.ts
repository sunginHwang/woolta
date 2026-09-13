// prefetchPostList 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useGetRecentPostListQuery, usePostListQuery } from '../../_shared/api/gql.generated';
import { POSTS_QUERY_KEY } from '../../_shared/query-keys';
import type { PostSummary } from '../../_shared/types';

/** 카테고리 칩의 '최신' 탭 값. 특정 카테고리가 아니라 전체 최신 목록을 뜻한다. */
const ALL_CATEGORY_ID = '-1';

/**
 * '최신' 탭은 getRecentPostList(최신순 20건), 그 외는 postList(카테고리 필터)를 쓴다.
 * 레거시 GET /post/categories/new/posts 도 최신순 20건이었다(실측 확인).
 *
 * postList 는 서버에서 정렬하지 않으므로 클라이언트에서 최신순으로 세운다.
 */
export async function fetchPostList(categoryId: string): Promise<PostSummary[]> {
  if (categoryId === ALL_CATEGORY_ID) {
    const data = await useGetRecentPostListQuery.fetcher()();

    return data.getRecentPostList.itemList;
  }

  const data = await usePostListQuery.fetcher({ categoryId: Number(categoryId) })();

  return [...data.postList.itemList].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 카테고리 구분 없는 전체 글. 사이트맵 생성용이라 react-query 를 거치지 않는다.
 *
 * 레거시 `GET /post/categories/posts/all` 대응 — `postList` 리졸버가 categoryId 를 받지 않으면
 * where 를 비워 전체를 돌려준다(PostService.getPostList). 전용 쿼리가 따로 필요하지 않다.
 */
export async function fetchAllPosts(): Promise<PostSummary[]> {
  const data = await usePostListQuery.fetcher({})();

  return data.postList.itemList;
}

export const usePostList = (categoryId: string) => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [POSTS_QUERY_KEY, categoryId],
    queryFn: () => fetchPostList(categoryId),
  });
  const post_list: PostSummary[] = data ?? [];

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
