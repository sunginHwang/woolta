'use client';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { SkeletonBar } from '@wds';
import { Suspense } from 'react';
import AccountBookList from '../components/account-books/main';
import { TestComp } from '../components/account-books/main/test-comp/TestComp';
import { getData } from '../utils/api';

export default async function AccountBooks() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['getAccountBookCategories'],
    queryFn: async () => {
      const { data } = await getData(`/account-book-categories`);
      return data;
    },
  });

  // await queryClient.prefetchQuery({
  //   queryKey: ['accountBookList', '2024-09'],
  //   queryFn: async () => {
  //     //      const { data } = await getData(`/account-books?dateTime=${new Date()}`);
  //     const { data } = await getData(`/account-books?dateTime=2024-09`);
  //     return dummy.data;
  //     return data;
  //   },
  // });

  // return (
  //   <HydrationBoundary state={dehydrate(queryClient)}>
  //     <AccountBookList />
  //   </HydrationBoundary>
  // );

  return (
    <>
      <Suspense fallback={<SkeletonBar />}>
        <TestComp />
      </Suspense>
      <AccountBookList />
    </>
  );
}
