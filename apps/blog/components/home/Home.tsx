import { Suspense } from 'react';
import { PostCategories } from './post-categories/PostCategories';
import { RecentPostList } from './recent-post-list/RecentPostList';
import { PostListSkeleton } from '../posts/post-list/PostListSkeleton';
import styles from './Home.module.css';

export const Home = () => {
  return (
    <div className={styles.container}>
      <PostCategories />
      <Suspense fallback={<PostListSkeleton />}>
        <RecentPostList />
      </Suspense>
    </div>
  );
};
