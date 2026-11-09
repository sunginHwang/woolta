import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchWeeklyBudget } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import WeeklyBudgetPage from '../../../domains/settings/weekly-budget/WeeklyBudgetPage';

export default async function WeeklyBudget() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  await prefetchWeeklyBudget(queryClient, { cookie });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <WeeklyBudgetPage />
    </HydrationBoundary>
  );
}
