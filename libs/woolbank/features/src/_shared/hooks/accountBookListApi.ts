// 가계부 목록 조회의 쿼리키 · fetcher · 서버 프리페치를 소유한다.
// RSC 에서 import 해야 하므로 'use client' 를 붙이지 않는다.
import { type PrefetchOptions, toPrefetchHeaders } from '@common/graphql';
import type { QueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { AccountBookPartsFragment } from '../api/gql.generated';
import { useAccountBookListQuery as useGeneratedAccountBookListQuery } from '../api/gql.generated';

export type AccountBook = AccountBookPartsFragment;
export type AcccountBookType = AccountBook['type'];

/**
 * 서버는 조회 기준을 DateTime 으로 받는다. 화면이 다루는 값은 'YYYY-MM' 이므로 그 달의 시작으로 맞춘다.
 * (레거시 REST 는 `?dateTime=${new Date(searchDate)}` 로 Date.toString() 결과를 인코딩 없이 보냈다.)
 */
const toDateTime = (searchDate: string) => dayjs(searchDate).startOf('month').toISOString();

export function getAccountBookListQueryKey(selectedDate: string) {
  return useGeneratedAccountBookListQuery.getKey({ dateTime: toDateTime(selectedDate) });
}

export const fetchAccountBookList = async (searchDate: string, options: PrefetchOptions = {}) => {
  const data = await useGeneratedAccountBookListQuery.fetcher(
    { dateTime: toDateTime(searchDate) },
    toPrefetchHeaders(options),
  )();

  return data.accountBookList.itemList;
};

export function prefetchAccountBookList(
  client: QueryClient,
  { selectedDate, cookie }: { selectedDate: string } & PrefetchOptions,
) {
  return client.prefetchQuery({
    queryKey: getAccountBookListQueryKey(selectedDate),
    queryFn: () => fetchAccountBookList(selectedDate, { cookie }),
  });
}
