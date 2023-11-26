import { useQuery } from '@tanstack/react-query';
import { BLOG_API } from 'apps/blog/config';
import { IPost } from 'apps/blog/types/post/IPost';
import apiCall from 'apps/blog/utils/apiCall';
import { useParams } from 'next/navigation';

const POST_QUERY_KEY: string = 'getPost';

type ApiRes<T> = {
  data: T;
  code: number;
};

export async function fetchPost(categoryNo: number, postNo: number) {
  try {
    const response = await apiCall.get<ApiRes<IPost>>(`${BLOG_API}/post/categories/${categoryNo}/posts/${postNo}`);
    return response.data.data;
  } catch {
    return null;
  }
}

export const usePost = () => {
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };

  const { data, ...rest } = useQuery({
    queryKey: [POST_QUERY_KEY, categoryNo, postNo],
    queryFn: () => fetchPost(Number(categoryNo), Number(postNo)),
  });

  return {
    post: data,
    ...rest,
  };
};
