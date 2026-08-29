'use client';

import * as stylex from '@stylexjs/stylex';
import { Suspense } from 'react';
import { PostCategories } from './PostCategories';
import { PostListSkeleton } from './PostListSkeleton';
import { RecentPostList } from './RecentPostList';

const styles = stylex.create({
  container: {
    marginTop: '2rem',
  },
});

export const Home = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <PostCategories />
      <Suspense fallback={<PostListSkeleton />}>
        <RecentPostList />
      </Suspense>
    </div>
  );
};
