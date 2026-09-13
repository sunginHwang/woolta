export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import { AccountBookSavePage } from '../../../domains/account-books/save/AccountBookSavePage';

/**
 * 저장 화면도 목록·카테고리를 읽는다(상세 훅이 목록 캐시를 함께 갱신한다).
 * 프리페치가 없으면 SSR 이 쿠키 없이 조회해 UNAUTHENTICATED 로 떨어지고
 * 클라이언트 렌더로 폴백한다 — 이관 전에도 같았던 문제라 여기서 함께 고친다.
 */
export default async function AccountBookSave() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  await prefetchAccountBookMain(queryClient, { cookie });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookSavePage />
    </HydrationBoundary>
  );
}
