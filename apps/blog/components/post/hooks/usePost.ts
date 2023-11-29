import { useQuery } from '@tanstack/react-query';
import { IPost } from 'apps/blog/types/post/IPost';
import { getData } from 'apps/blog/utils/apiCall';
import { useParams } from 'next/navigation';

const POST_QUERY_KEY: string = 'getPost';

export async function fetchPost(categoryNo: number, postNo: number) {
  try {
    const { data } = await getData<IPost>(`/post/categories/${categoryNo}/posts/${postNo}`);
    return data;
  } catch {
    return null;
  }
}

export const usePost = () => {
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };

  const { data, ...rest } = useQuery({
    queryKey: getPostQueryKey(Number(categoryNo), Number(postNo)),
    queryFn: () => fetchPost(Number(categoryNo), Number(postNo)),
  });

  return {
    post: data,
    ...rest,
  };
};

export function getPostQueryKey(categoryNo: number, postNo: number) {
  return [POST_QUERY_KEY, categoryNo, postNo];
}
