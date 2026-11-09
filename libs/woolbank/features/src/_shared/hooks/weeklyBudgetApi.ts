// 주간 예산 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { WeeklyBudgetUsagePartsFragment } from '../api/gql.generated';
import { useWeeklyBudgetQuery, useWeeklyBudgetUsageQuery } from '../api/gql.generated';

export type WeeklyBudgetUsage = WeeklyBudgetUsagePartsFragment;

/**
 * 사용 현황은 `dateTime` 을 생략하면 서버가 "지금" 이 속한 주(월~일)로 계산한다.
 * 변수 객체는 서버 prefetch 와 클라이언트 훅이 같은 모양이어야 캐시가 맞으므로 여기서만 만든다.
 */
const usageVariables = (dateTime?: string) => (dateTime ? { dateTime } : {});

export const weeklyBudgetKey = () => useWeeklyBudgetQuery.getKey();
export const weeklyBudgetUsageKey = (dateTime?: string) => useWeeklyBudgetUsageQuery.getKey(usageVariables(dateTime));
/** 어느 주차 쿼리든 함께 무효화하려고 오퍼레이션 이름만 자른 prefix */
export const weeklyBudgetUsageKeyPrefix = () => useWeeklyBudgetUsageQuery.getKey();

export const fetchWeeklyBudget = async (options: PrefetchOptions = {}) => {
  const data = await useWeeklyBudgetQuery.fetcher({}, toPrefetchHeaders(options))();

  return data.weeklyBudget;
};

export const fetchWeeklyBudgetUsage = async (dateTime?: string, options: PrefetchOptions = {}) => {
  const data = await useWeeklyBudgetUsageQuery.fetcher(usageVariables(dateTime), toPrefetchHeaders(options))();

  return data.weeklyBudgetUsage;
};

export function prefetchWeeklyBudget(client: QueryClient, options: PrefetchOptions = {}) {
  return client.prefetchQuery({
    queryKey: weeklyBudgetKey(),
    queryFn: () => fetchWeeklyBudget(options),
  });
}

export function prefetchWeeklyBudgetUsage(client: QueryClient, options: PrefetchOptions = {}) {
  return client.prefetchQuery({
    queryKey: weeklyBudgetUsageKey(),
    queryFn: () => fetchWeeklyBudgetUsage(undefined, options),
  });
}

/** 예산 저장·가계부 변경 뒤 예산 금액과 사용 현황을 함께 무효화한다 */
export function invalidateWeeklyBudget(client: QueryClient) {
  return Promise.all([
    client.invalidateQueries({ queryKey: weeklyBudgetKey() }),
    client.invalidateQueries({ queryKey: weeklyBudgetUsageKeyPrefix() }),
  ]);
}
