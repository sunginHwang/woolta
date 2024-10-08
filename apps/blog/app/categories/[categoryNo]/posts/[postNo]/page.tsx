import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchPost } from '../../../../../components/post/hooks/usePost';
import { Post } from '../../../../../components/post/Post';
import { PostLoading } from '../../../../../components/post/post-loading/PostLoading';
import { Suspense } from 'react';

interface Props {
  params: { categoryNo: string; postNo: string };
}

const PostDetailPage = async ({ params: { categoryNo, postNo } }: Props) => {
  const queryClient = new QueryClient();
  await prefetchPost(queryClient, { categoryNo, postNo });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PostLoading />}>
        <Post />
      </Suspense>
    </HydrationBoundary>
  );
};

export default PostDetailPage;
