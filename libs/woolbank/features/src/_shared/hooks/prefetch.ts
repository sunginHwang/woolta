import type { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { prefetchAccountBookCategories } from './accountBookCategoryApi';
import { prefetchAccountBookList } from './accountBookListApi';
import { prefetchWeeklyBudgetUsage } from './weeklyBudgetApi';

/**
 * AccountBookMain 스크린에 필요한 데이터를 서버에서 prefetch합니다.
 *
 * 쿼리키와 조회 함수는 각 api 모듈이 소유한다 — 여기서는 조합만 한다.
 */
export async function prefetchAccountBookMain(
  queryClient: QueryClient,
  opts: { cookie?: string; withWeeklyBudget?: boolean } = {},
) {
  await Promise.all([
    prefetchAccountBookCategories(queryClient, { cookie: opts.cookie }),
    prefetchAccountBookList(queryClient, {
      selectedDate: dayjs().format('YYYY-MM'),
      cookie: opts.cookie,
    }),
    // 주간 예산 카드는 woolbank 홈에만 있다 — 대시보드 호출은 기본값(false)으로 기존 동작을 유지한다
    ...(opts.withWeeklyBudget ? [prefetchWeeklyBudgetUsage(queryClient, { cookie: opts.cookie })] : []),
  ]);
}
