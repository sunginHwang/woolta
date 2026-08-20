export const dynamic = 'force-dynamic';

import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import { AccountBookMainScreen, WoolbankScreensProvider } from '@woolta/woolbank-screens';

export default async function BankPage() {
  const cookie = cookies().toString();
  const queryClient = new QueryClient();

  await prefetchAccountBookMain(queryClient, { cookie });

  return (
    <WoolbankScreensProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <AccountBookMainScreen />
      </HydrationBoundary>
    </WoolbankScreensProvider>
  );
}
