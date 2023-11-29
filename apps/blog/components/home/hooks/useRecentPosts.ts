import { useQuery } from '@tanstack/react-query';
import { IPost } from 'apps/blog/types/post/IPost';
import { getData } from 'apps/blog/utils/apiCall';

export const POSTS_QUERY_KEY: string = 'getPosts';

export async function fetchRecentPosts() {
  const { data } = await getData<IPost[]>(`/post/categories/new/posts`);
  return data;
}

export const useRecentPosts = () => {
  const { data, ...rest } = useQuery({ queryKey: [POSTS_QUERY_KEY], queryFn: fetchRecentPosts });
  const recent_posts: IPost[] = data ?? [];
  return {
    recent_posts,
    ...rest,
  };
};
