import { useQuery } from '@tanstack/react-query';
import { BLOG_API } from 'apps/blog/config';
import { IPost } from 'apps/blog/types/post/IPost';
import apiCall from 'apps/blog/utils/apiCall';

const RECNET_POSTS_QUERY_KEY: string = 'getRecentPosts';

type ApiRes<T> = {
  data: T;
  code: number;
};

export async function fetchRecentPosts() {
  const { data } = await apiCall.get<ApiRes<IPost[]>>(`${BLOG_API}/post/categories/new/posts`);
  return data.data;
}

export const useRecentPosts = () => {
  const { data, ...rest } = useQuery({ queryKey: [RECNET_POSTS_QUERY_KEY], queryFn: fetchRecentPosts });
  const recent_posts: IPost[] = data ?? [];
  return {
    recent_posts,
    ...rest,
  };
};
