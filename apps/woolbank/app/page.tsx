import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchAccountBookMain } from '@woolta/woolbank-features';
import { cookies } from 'next/headers';
import AccountBookHomePage from '../domains/account-books/main/AccountBookHomePage';

export default async function AccountBooks() {
  const cookie = (await cookies()).toString();
  const queryClient = new QueryClient();

  // 카테고리·이달 목록·이번 주 예산 사용 현황을 한 번에 — 쿼리키와 조회 함수는 libs 의 api 모듈이 소유한다
  await prefetchAccountBookMain(queryClient, { cookie, withWeeklyBudget: true });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountBookHomePage />
    </HydrationBoundary>
  );
}
