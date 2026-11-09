'use client';

// 주간 예산 화면 훅 — 쿼리키·fetcher 는 weeklyBudgetApi 가 소유하고 여기서는 Suspense 훅과 저장 뮤테이션만 감싼다.
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useSaveWeeklyBudgetMutation as useGeneratedSaveWeeklyBudgetMutation } from '../api/gql.generated';
import {
  fetchWeeklyBudget,
  fetchWeeklyBudgetUsage,
  invalidateWeeklyBudget,
  weeklyBudgetKey,
  weeklyBudgetUsageKey,
} from './weeklyBudgetApi';

/** 설정된 주간 예산 금액. 미설정이면 0 */
export const useWeeklyBudget = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: weeklyBudgetKey(),
    queryFn: () => fetchWeeklyBudget(),
  });

  return { amount: data.amount, ...rest };
};

/**
 * 이번 주(월~일) 예산 사용 현황. 선택한 달과 무관하게 항상 오늘이 속한 주다 —
 * 과거 달을 넘겨보는 동안 "이번 주" 라벨이 바뀌면 오히려 혼란스럽다.
 */
export const useWeeklyBudgetUsage = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: weeklyBudgetUsageKey(),
    queryFn: () => fetchWeeklyBudgetUsage(),
    staleTime: 60 * 1000,
  });

  return { usage: data, ...rest };
};

export const useInvalidateWeeklyBudget = () => {
  const queryClient = useQueryClient();

  return () => invalidateWeeklyBudget(queryClient);
};

export const useSaveWeeklyBudgetMutation = () => {
  const invalidate = useInvalidateWeeklyBudget();

  return useGeneratedSaveWeeklyBudgetMutation({ onSuccess: invalidate });
};
