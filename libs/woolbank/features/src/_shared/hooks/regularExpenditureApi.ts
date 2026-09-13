// 정기지출 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import type {
  RegularExpenditureGroupPartsFragment,
  RegularExpenditureItemPartsFragment,
} from '../api/gql.generated';
import { useRegularExpenditureGroupListQuery } from '../api/gql.generated';

export type RegularExpenditure = RegularExpenditureItemPartsFragment;
export type RegularExpenditureListItem = RegularExpenditureGroupPartsFragment;

export const regularExpenditureListKey = () => useRegularExpenditureGroupListQuery.getKey({});

/**
 * 레거시는 실패를 `[]` 로 삼켰다(세션 만료가 "내역 없음"으로 보인다).
 * 이관 범위를 넓히지 않기 위해 지금은 그 동작을 그대로 옮긴다 —
 * 에러 노출은 이관 완료 후 한 번에 다룬다.
 */
export const fetchRegularExpenditureList = async (options: PrefetchOptions = {}) => {
  try {
    const data = await useRegularExpenditureGroupListQuery.fetcher({}, toPrefetchHeaders(options))();

    return data.regularExpenditureGroupList.itemList;
  } catch {
    return [];
  }
};

export function prefetchRegularExpenditureList(client: QueryClient, options: PrefetchOptions = {}) {
  return client.prefetchQuery({
    queryKey: regularExpenditureListKey(),
    queryFn: () => fetchRegularExpenditureList(options),
  });
}
