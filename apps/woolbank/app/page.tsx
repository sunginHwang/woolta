export const dynamic = 'force-dynamic';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import AccountBookList from '../components/account-books/main';
import { prefetchAccountBookList } from '../components/account-books/main/hooks/useAccountBookListQuery';
import { getData } from '../utils/api';

export default async function AccountBooks() {
  const headers = {
    Cookie: cookies().toString(),
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['getAccountBookCategories'],
    queryFn: async () => {
      const { data } = await getData(`/account-book-categories`, { headers });
      return data;
    },
  });
  await prefetchAccountBookList(queryClient, { selectedDate: '2024-09', config: { headers } });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookList />
    </HydrationBoundary>
  );
}
