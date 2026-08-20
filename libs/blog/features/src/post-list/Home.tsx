'use client';

import { Suspense } from 'react';
import { styled } from 'styled-components';
import { PostCategories } from './PostCategories';
import { PostListSkeleton } from './PostListSkeleton';
import { RecentPostList } from './RecentPostList';

export const Home = () => {
  return (
    <SC.Container>
      <PostCategories />
      <Suspense fallback={<PostListSkeleton />}>
        <RecentPostList />
      </Suspense>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    margin-top: 2rem;
  `,
};
