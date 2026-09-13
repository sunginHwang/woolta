export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain, prefetchAccountBookStatistics } from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { Statistic } from '../../domains/account-book-statistic/Statistic/Statistic';

export default async function RegularExtenditurePage() {
  const cookie = (await cookies()).toString();

  const queryClient = new QueryClient();
  await prefetchAccountBookMain(queryClient, { cookie });
  await prefetchAccountBookStatistics(queryClient, {
    range: {
      startDate: dayjs().startOf('month'),
      endDate: dayjs().endOf('month'),
      type: 'EXPENDITURE',
    },
    cookie,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Statistic />
    </HydrationBoundary>
  );
}
