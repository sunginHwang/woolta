'use client';

import { useHomeRouterProps } from './hooks/useHomeRouterProps';
import { usePostList } from './hooks/usePostList';
import PostList from './PostList';

export const RecentPostList = () => {
  const { categoryId } = useHomeRouterProps();
  const { post_list } = usePostList(categoryId);
  return <PostList post_list={post_list} />;
};
