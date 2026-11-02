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
  // 필터와 비중 분모를 서버가 함께 처리한다 — 화면에서 걸러내면 조각 합이 100% 가 되지 않는다
  const range = { ...accountBookStatisticFilter, onlyUseStatistic: !allVisibilityStatistic };

  const { data, ...rest } = useSuspenseQuery({
    queryKey: accountBookStatisticKey(range),
    queryFn: () => fetchAccountBookStatistics(range),
  });

  return {
    accountBookStatisticList: data ?? [],
    ...rest,
  };
};
