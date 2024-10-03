export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Home } from '../components/home/Home';
import { prefetchPostList } from '../components/home/hooks/usePostList';
import { prefetchCategories } from '../components/home/hooks/useCategories';

interface Props {
  searchParams: { category: string | undefined };
}
export default async function Index({ searchParams }: Props) {
  const queryClient = new QueryClient();
  const categoryId = searchParams?.category ?? '-1';
  
  await Promise.all([prefetchPostList(queryClient, categoryId), prefetchCategories(queryClient)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
