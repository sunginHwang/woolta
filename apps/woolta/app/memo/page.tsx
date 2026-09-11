export const dynamic = 'force-dynamic';

import { prefetchMemoList } from '@memo/screens';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';
import { MemoApp } from '../../components/memo/MemoApp';

export default async function MemoPage() {
  const queryClient = new QueryClient();

  // 메모는 사용자별 데이터라 RSC fetch 에 인증 쿠키를 직접 실어줘야 한다.
  await prefetchMemoList(queryClient, { cookie: (await cookies()).toString() });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MemoApp />
    </HydrationBoundary>
  );
}
