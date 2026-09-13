'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import {
  fetchRegularExpenditureList,
  type RegularExpenditure,
  type RegularExpenditureListItem,
  regularExpenditureListKey,
} from '@woolta/woolbank-features';

export { prefetchRegularExpenditureList as prefetchRegularExtentureList } from '@woolta/woolbank-features';
// 조회 함수·쿼리키는 libs 의 api 모듈이 소유한다 — 여기서는 화면이 쓰는 형태로만 감싼다.
export type { RegularExpenditure, RegularExpenditureListItem };

export const useRegularExtentureListQuery = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: regularExpenditureListKey(),
    queryFn: () => fetchRegularExpenditureList(),
  });

  return {
    regularExpenditureTypeList: data ?? [],
    ...rest,
  };
};
