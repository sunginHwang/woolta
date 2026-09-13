export const dynamic = 'force-dynamic';

import { Home, prefetchBlogList } from '@blog/features';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

interface Props {
  searchParams: Promise<{ category: string | undefined }>;
}

export default async function Index(props: Props) {
  const searchParams = await props.searchParams;
  const queryClient = new QueryClient();
  const category = searchParams?.category ?? '-1';

  await prefetchBlogList(queryClient, { category });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
