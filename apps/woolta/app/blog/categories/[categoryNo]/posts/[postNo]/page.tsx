import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BlogPostDetailScreen, BlogScreensProvider, prefetchBlogPost } from '@blog/screens';

interface Props {
  params: { categoryNo: string; postNo: string };
}

export default async function BlogPostDetailPage({ params: { categoryNo, postNo } }: Props) {
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
