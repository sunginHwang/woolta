import PostList from '../posts/PostList';
import CategoryChips from './common/CategoryChips';
import { useRecentPosts } from './hooks/useRecentPosts';

function Home() {
  const { recent_posts, isLoading } = useRecentPosts();
  return (
    <>
      <CategoryChips />
      <PostList is_loading={isLoading} post_list={recent_posts} />
    </>
  );
}

export default Home;
