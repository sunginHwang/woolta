'use client';

import { Post, PostLoading } from '@blog/features';
import { Suspense } from 'react';

export function BlogPostDetailScreen() {
  return (
    <Suspense fallback={<PostLoading />}>
      <Post />
    </Suspense>
  );
}