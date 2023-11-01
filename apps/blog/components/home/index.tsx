import PostList from '../posts/PostList';
import { useRecentPosts } from './hooks/useRecentPosts';

function Home() {
  const { recent_posts, isLoading } = useRecentPosts();
  return <PostList is_loading={isLoading} post_list={recent_posts} />;
}

export default Home;
