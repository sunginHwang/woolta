import { Post, PostLoading, prefetchBlogPost } from '@blog/features';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';

interface Props {
  params: Promise<{ categoryNo: string; postNo: string }>;
}

const PostDetailPage = async (props: Props) => {
  const params = await props.params;

  const { categoryNo, postNo } = params;

  const queryClient = new QueryClient();
  await prefetchBlogPost(queryClient, { categoryNo, postNo });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PostLoading />}>
        <Post />
      </Suspense>
    </HydrationBoundary>
  );
};

export default PostDetailPage;
