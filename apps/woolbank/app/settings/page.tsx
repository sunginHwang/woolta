import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchWeeklyBudget } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import SettingsPage from '../../domains/settings/SettingsPage';

export default async function Settings() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  await prefetchWeeklyBudget(queryClient, { cookie });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsPage />
    </HydrationBoundary>
  );
}
