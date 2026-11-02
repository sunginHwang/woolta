// 가계부 통계 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { Dayjs } from 'dayjs';
import type { AccountBookCategoryType } from '../api/gql.generated';
import { type StatisticPartsFragment, useGetAccountBookStatisticListQuery } from '../api/gql.generated';

export type AccountBookStatistic = StatisticPartsFragment;

export interface AccountStatisticRange {
  startDate: Dayjs;
  endDate: Dayjs;
  type: AccountBookCategoryType;
  /**
   * true 면 서버가 통계 제외 카테고리(useStatistic=false)를 빼고, 비중도 남은 항목 합계 기준으로 내려준다.
   * 화면에서 걸러내면 비중의 분모가 안 맞아 조각 합이 100% 가 되지 않았다 — 필터와 분모를 서버에서 함께 처리한다.
   */
  onlyUseStatistic?: boolean;
}

/**
 * 서버는 DateTime 스칼라를 받는다. 레거시 REST 는 `YYYY-MM-DD HH:mm:ss` 문자열을
 * 쿼리 파라미터로 보냈는데, 여기서는 ISO 8601 로 통일한다.
 */
const toDateTime = (date: Dayjs) => date.toISOString();

const toVariables = (range: AccountStatisticRange) => ({
  startDate: toDateTime(range.startDate),
  endDate: toDateTime(range.endDate),
  type: range.type,
  onlyUseStatistic: range.onlyUseStatistic ?? false,
});

/**
 * 쿼리키.
 *
 * 레거시는 `'accountBookList'` 접두사를 목록 조회와 공유했고 `Dayjs` 인스턴스를 키에 담았다.
 * Dayjs 는 직렬화되지 않아 dehydrate/hydrate 를 통과하지 못한다 — 생성 훅의 getKey 를 쓰면
 * 도메인별로 접두사가 갈리고 값도 문자열이 된다.
 */
export const accountBookStatisticKey = (range: AccountStatisticRange) =>
  useGetAccountBookStatisticListQuery.getKey(toVariables(range));

export const fetchAccountBookStatistics = async (range: AccountStatisticRange, options: PrefetchOptions = {}) => {
  const data = await useGetAccountBookStatisticListQuery.fetcher(toVariables(range), toPrefetchHeaders(options))();

  return data.getAccountBookStatisticList.itemList;
};

export function prefetchAccountBookStatistics(
  client: QueryClient,
  { range, cookie }: { range: AccountStatisticRange } & PrefetchOptions,
) {
  return client.prefetchQuery({
    queryKey: accountBookStatisticKey(range),
    queryFn: () => fetchAccountBookStatistics(range, { cookie }),
  });
}
