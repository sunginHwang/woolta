export const dynamic = 'force-dynamic';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import AccountBookList from '../components/account-books/main/AccountBookListPage';
import { prefetchAccountBookList } from '../components/account-books/main/_common/hooks/useAccountBookListQuery';
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
  await prefetchAccountBookList(queryClient, { selectedDate: dayjs().format('YYYY-MM'), config: { headers } });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookList />
    </HydrationBoundary>
  );
}
