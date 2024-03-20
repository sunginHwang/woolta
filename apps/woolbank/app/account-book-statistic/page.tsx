'use client';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { Statistic } from '../..//components/account-book-statistic/Statistic';
import { getData } from '../../utils/api';

export default async function RegularExtenditurePage() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['getAccountBookCategories'],
    queryFn: async () => {
      const { data } = await getData(`/account-book-categories`);
      return data;
    },
  });

  await queryClient.prefetchQuery({
    queryKey: ['accountBookList'],
    queryFn: async () => {
      const { data } = await getData(`/account-books?dateTime=${new Date()}`);
      return data;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Statistic />
    </HydrationBoundary>
  );
}
