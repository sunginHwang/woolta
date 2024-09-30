import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { getData } from '../../../../utils/api';

export const ACCOUNT_BOOK_LIST_QUERY_KEY = 'accountBookList';

export type AcccountBookType = 'expenditure' | 'income';

export interface AccountBook {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
    type: AcccountBookType;
    accountBookCategoryImage: {
      imageUrl: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };
  type: AcccountBookType;
  isRegularExpenditure: boolean;
  amount: number;
  memo?: string;
  registerDateTime: Date;
}

/*
 * 가계부 리스트 조회
 * */
export const fetchAccountBookList = async (searchDate: string, config?: AxiosRequestConfig) => {
  const { data } = await getData<AccountBook[]>(`/account-books?dateTime=${new Date(searchDate)}`, config);

  return data.map((item) => {
    return {
      ...item,
      registerDateTime: new Date(item.registerDateTime),
    };
  });
};

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

export function getAccountBookListQueryKey(selectedDate: string) {
  return [ACCOUNT_BOOK_LIST_QUERY_KEY, selectedDate];
}

export function prefetchAccountBookList(
  client: QueryClient,
  { selectedDate, config }: { selectedDate: string; config?: AxiosRequestConfig },
) {
  return client.prefetchQuery({
    queryKey: getAccountBookListQueryKey(selectedDate),
    queryFn: () => fetchAccountBookList(selectedDate, config),
  });
}
