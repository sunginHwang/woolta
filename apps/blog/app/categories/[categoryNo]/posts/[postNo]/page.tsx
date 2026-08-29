import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Suspense } from 'react';
import { prefetchPost } from '../../../../../components/post/hooks/usePost';
import { Post } from '../../../../../components/post/Post';
import { PostLoading } from '../../../../../components/post/post-loading/PostLoading';

interface Props {
  params: Promise<{ categoryNo: string; postNo: string }>;
}

const PostDetailPage = async (props: Props) => {
  const params = await props.params;

  const { categoryNo, postNo } = params;

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
