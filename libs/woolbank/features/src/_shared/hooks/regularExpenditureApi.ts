// 정기지출 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { isUnauthenticatedError, type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type { RegularExpenditureGroupPartsFragment, RegularExpenditureItemPartsFragment } from '../api/gql.generated';
import { useRegularExpenditureGroupListQuery } from '../api/gql.generated';

export type RegularExpenditure = RegularExpenditureItemPartsFragment;
export type RegularExpenditureListItem = RegularExpenditureGroupPartsFragment;

export const regularExpenditureListKey = () => useRegularExpenditureGroupListQuery.getKey({});

/**
 * 레거시는 모든 실패를 `[]` 로 삼켜 **세션이 끊겨도 "내역 없음"으로 보였다.**
 * 인증 오류만 그대로 올리고, 그 외 실패는 빈 목록으로 떨어뜨려 기존 동작을 지킨다.
 */
export const fetchRegularExpenditureList = async (options: PrefetchOptions = {}) => {
  try {
    const data = await useRegularExpenditureGroupListQuery.fetcher({}, toPrefetchHeaders(options))();

    return data.regularExpenditureGroupList.itemList;
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      throw error;
    }

    return [];
  }
};

export function prefetchRegularExpenditureList(client: QueryClient, options: PrefetchOptions = {}) {
  return client.prefetchQuery({
    queryKey: regularExpenditureListKey(),
    queryFn: () => fetchRegularExpenditureList(options),
  });
}
