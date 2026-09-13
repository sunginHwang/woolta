export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookCategories, prefetchRegularExpenditureList } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import { RegularExpenditure } from '../../domains/regular-extenditure/main';

export default async function RegularExtenditurePage() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  // 저장 폼이 카테고리를 고르므로 목록과 함께 미리 받아둔다
  await Promise.all([
    prefetchAccountBookCategories(queryClient, { cookie }),
    prefetchRegularExpenditureList(queryClient, { cookie }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RegularExpenditure />
    </HydrationBoundary>
  );
}
