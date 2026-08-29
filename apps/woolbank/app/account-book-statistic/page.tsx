export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { prefetchAccountStatisticListQuery } from '../../domains/account-book-statistic/Statistic/_common/hooks/useAccountStatisticListQuery';
import { Statistic } from '../../domains/account-book-statistic/Statistic/Statistic';
import { prefetchAccountBookList } from '../../domains/account-books/main/_common/hooks/useAccountBookListQuery';
import { getData } from '../../utils/api';

export default async function RegularExtenditurePage() {
  const config: AxiosRequestConfig = {
    headers: {
      Cookie: (await cookies()).toString(),
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
