export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import dayjs from 'dayjs';
import { cookies } from 'next/headers';
import { prefetchAccountStatisticListQuery } from '../../domains/account-book-statistic/Statistic/_common/hooks/useAccountStatisticListQuery';
import { Statistic } from '../../domains/account-book-statistic/Statistic/Statistic';

export default async function RegularExtenditurePage() {
  const cookie = (await cookies()).toString();
  // 통계는 아직 레거시 REST 다 (슬라이스 B) — axios 설정이 따로 필요하다
  const config = { headers: { Cookie: cookie } };

  const queryClient = new QueryClient();
  await prefetchAccountBookMain(queryClient, { cookie });
  await prefetchAccountStatisticListQuery(queryClient, {
    accountBookStatisticFilter: {
      startDate: dayjs().startOf('month'),
      endDate: dayjs().endOf('month'),
      type: 'EXPENDITURE',
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
