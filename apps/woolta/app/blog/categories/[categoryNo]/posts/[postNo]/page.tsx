import { BlogPostDetailScreen, BlogScreensProvider, prefetchBlogPost } from '@blog/screens';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  params: Promise<{ categoryNo: string; postNo: string }>;
}

export default async function BlogPostDetailPage(props: Props) {
  const params = await props.params;

  const { categoryNo, postNo } = params;

  const queryClient = new QueryClient();
  await prefetchBlogPost(queryClient, { categoryNo, postNo });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogScreensProvider basePath='/blog'>
        <BlogPostDetailScreen />
      </BlogScreensProvider>
    </HydrationBoundary>
  );
}
