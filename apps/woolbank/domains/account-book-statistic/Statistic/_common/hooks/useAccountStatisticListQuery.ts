'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  type AccountBookStatistic,
  accountBookStatisticKey,
  fetchAccountBookStatistics,
} from '@woolta/woolbank-features';
import type { AccountStatisticFilter } from '../stores/statisticFilter';

// 조회 함수·쿼리키는 libs 의 api 모듈이 소유한다 — 여기서는 화면이 쓰는 형태로만 감싼다.
export type { AccountBookStatistic };
// 차트 컴포넌트들이 쓰는 항목 타입 — 생성 fragment 에서 파생한다
export type AccountBookStatisticCategoryItem = AccountBookStatistic['list'][number];

export const useAccountStatisticListQuery = (
  accountBookStatisticFilter: AccountStatisticFilter,
  allVisibilityStatistic: boolean,
) => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: accountBookStatisticKey(accountBookStatisticFilter),
    queryFn: () => fetchAccountBookStatistics(accountBookStatisticFilter),
  });

  const accountBookStatisticList = data?.filter((item) => allVisibilityStatistic || item.useStatistic) ?? [];

  return {
    accountBookStatisticList,
    ...rest,
  };
};
