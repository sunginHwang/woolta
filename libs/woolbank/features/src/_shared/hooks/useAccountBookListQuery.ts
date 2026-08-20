'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { AccountBook, fetchAccountBookList, getAccountBookListQueryKey } from './accountBookListApi';

export * from './accountBookListApi';

export const useAccountBookListQuery = (searchDate: string) => {
  const queryKey = getAccountBookListQueryKey(searchDate);
  const { data, ...rest } = useSuspenseQuery<AccountBook[]>({
    queryKey,
    queryFn: () => fetchAccountBookList(searchDate),
  });

  const accountBookList = data ?? [];

  return {
    accountBookList,
    ...rest,
  };
};
