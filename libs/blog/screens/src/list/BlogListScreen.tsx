'use client';

import { Home } from '@blog/features';

interface Props {
  category?: string;
}

export function BlogListScreen({ category: _category }: Props) {
  // category is used server-side for prefetching; client reads from searchParams internally
  return <Home />;
}