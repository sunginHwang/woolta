export const dynamic = 'force-dynamic';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { Statistic } from '../..//components/account-book-statistic/Statistic';
import { prefetchAccountStatisticListQuery } from '../../components/account-book-statistic/Statistic/hooks/useAccountStatisticListQuery';
import { prefetchAccountBookList } from '../../components/account-books/main/hooks/useAccountBookListQuery';
import { getData } from '../../utils/api';

export default async function RegularExtenditurePage() {
  const config: AxiosRequestConfig = {
    headers: {
      Cookie: cookies().toString(),
    },
  };

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['getAccountBookCategories'],
    queryFn: async () => {
      const { data } = await getData(`/account-book-categories`, config);
      return data;
    },
  });

  await prefetchAccountBookList(queryClient, { selectedDate: '2024-09', config });
  await prefetchAccountStatisticListQuery(queryClient, {
    accountBookStatisticFilter: {
      startDate: dayjs().startOf('month'),
      endDate: dayjs().endOf('month'),
      type: 'expenditure',
      dateRange: 'month',
    },
    config,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Statistic />
    </HydrationBoundary>
  );
}
