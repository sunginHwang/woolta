export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BlogListScreen, BlogScreensProvider, prefetchBlogList } from '@blog/screens';

interface Props {
  searchParams: { category: string | undefined };
}

export default async function BlogListPage({ searchParams }: Props) {
  const queryClient = new QueryClient();
  const category = searchParams?.category ?? '-1';

  await prefetchBlogList(queryClient, { category });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogScreensProvider basePath='/blog'>
        <BlogListScreen category={category} />
      </BlogScreensProvider>
    </HydrationBoundary>
  );
}
