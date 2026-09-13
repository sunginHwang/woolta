export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import AccountBookList from '../domains/account-books/main/AccountBookListPage';

export default async function AccountBooks() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  // 카테고리와 이달 목록을 한 번에 — 쿼리키와 조회 함수는 libs 의 api 모듈이 소유한다
  await prefetchAccountBookMain(queryClient, { cookie });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookList />
    </HydrationBoundary>
  );
}
