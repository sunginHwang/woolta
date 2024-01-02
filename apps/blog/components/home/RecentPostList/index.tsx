import { Suspense } from 'react';
import PostList from '../../posts/PostList';
import { useRecentPosts } from '../hooks/useRecentPosts';

const RecentPostList = () => {
  return (
    <Suspense fallback={<PostList.Skeleton />}>
      <Core />
    </Suspense>
  );
};

const Core = () => {
  const { recent_posts } = useRecentPosts();
  return <PostList post_list={recent_posts} />;
};

export default RecentPostList;
