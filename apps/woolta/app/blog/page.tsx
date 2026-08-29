export const dynamic = 'force-dynamic';

import { BlogListScreen, BlogScreensProvider, prefetchBlogList } from '@blog/screens';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  searchParams: Promise<{ category: string | undefined }>;
}

export default async function BlogListPage(props: Props) {
  const searchParams = await props.searchParams;
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
