import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import AccountBookList from '../components/account-books/main';

export default async function AccountBooks() {
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery({
  //   queryKey: ['getAccountBookCategories'],
  //   queryFn: async () => {
  //     const { data } = await getData(`/account-book-categories`);
  //     return data;
  //   },
  // });

  // await queryClient.prefetchQuery({
  //   queryKey: ['accountBookList'],
  //   queryFn: async () => {
  //     const { data } = await getData(`/account-books?dateTime=${new Date()}`);
  //     return data;
  //   },
  // });

  // return (
  //   <HydrationBoundary state={dehydrate(queryClient)}>
  //     <AccountBookList />
  //   </HydrationBoundary>
  // );

  return <div>12</div>;
}
