// prefetchPost 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { usePostQuery } from '../../_shared/api/gql.generated';
import { getPostQueryKey } from '../../_shared/query-keys';
import type { PostDetail } from '../../_shared/types';

/** 없는 글은 서버가 null 을 준다. 조회 실패도 '없음'으로 다뤄 화면이 404 를 그리게 한다. */
export async function fetchPost(categoryNo: string, postNo: string): Promise<PostDetail | null> {
  try {
    const data = await usePostQuery.fetcher({ categoryNo: Number(categoryNo), postNo: Number(postNo) })();

    return data.post ?? null;
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
