'use client';
import PostList from '../../posts/post-list/PostList';
import { useHomeRouterProps } from '../hooks/useHomeRouterProps';
import { usePostList } from '../hooks/usePostList';

export const RecentPostList = () => {
  const { categoryId } = useHomeRouterProps();
  const { post_list } = usePostList(categoryId);
  return <PostList post_list={post_list} />;
};
