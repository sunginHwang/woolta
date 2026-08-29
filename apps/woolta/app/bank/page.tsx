export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import { WoolbankScreensProvider } from '@woolta/woolbank-screens';
import { cookies } from 'next/headers';
import { BankApp } from '../../components/bank/BankApp';

export default async function BankPage() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  await prefetchAccountBookMain(queryClient, { cookie });

  return (
    <WoolbankScreensProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BankApp />
      </HydrationBoundary>
    </WoolbankScreensProvider>
  );
}
