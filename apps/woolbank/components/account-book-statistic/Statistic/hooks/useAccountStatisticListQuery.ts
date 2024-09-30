import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { getData } from '../../../../utils/api';
import { AccountStatisticFilter } from '../store';
import { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';

export const ACCOUNT_BOOK_LIST_QUERY_KEY = 'accountBookList';

// 가계부 통계 리스트 아이템
export interface AccountBookStatistic {
  categoryId: number;
  categoryName: string;
  useStatistic: boolean;
  amount: number;
  percentage: number;
  list: AccountBookStatisticCategoryItem[];
}

export interface AccountBookStatisticCategoryItem {
  title: string;
  amount: number;
  registerDateTime: Dayjs;
}

/*
 * 가계부 통계
 * */
export const fetchAccountBookStatistics = async (filter: AccountStatisticFilter, config?: AxiosRequestConfig) => {
  const params = {
    type: filter.type,
    startDate: filter.startDate.format('YYYY-MM-DD HH:mm:ss'),
    endDate: filter.endDate.format('YYYY-MM-DD HH:mm:ss'),
  };

  const response = await getData<AccountBookStatistic[]>('account-books/statistics', {
    ...config,
    params,
  });

  const accountBookStatisticList = response.data.map((item) => {
    const listConvertDate = item.list.map((i) => {
      return { ...i, registerDateTime: dayjs(i.registerDateTime) };
    });
    return { ...item, list: listConvertDate };
  });

  return accountBookStatisticList;
};

export const useAccountStatisticListQuery = (
  AccountBookStatisticFilter: AccountStatisticFilter,
  allVisibilityStatistic: boolean,
) => {
  const { data, ...rest } = useSuspenseQuery<AccountBookStatistic[]>({
    queryKey: getQueryKey(AccountBookStatisticFilter),
    queryFn: () => fetchAccountBookStatistics(AccountBookStatisticFilter),
  });

  const accountBookStatisticList = data?.filter((item) => allVisibilityStatistic || item.useStatistic) ?? [];

  return {
    accountBookStatisticList,
    ...rest,
  };
};

function getQueryKey({ startDate, endDate, type }: AccountStatisticFilter) {
  return [ACCOUNT_BOOK_LIST_QUERY_KEY, startDate, endDate, type];
}

export function prefetchAccountStatisticListQuery(
  client: QueryClient,
  {
    accountBookStatisticFilter,
    config,
  }: { accountBookStatisticFilter: AccountStatisticFilter; config?: AxiosRequestConfig },
) {
  return client.prefetchQuery({
    queryKey: getQueryKey(accountBookStatisticFilter),
    queryFn: () => fetchAccountBookStatistics(accountBookStatisticFilter, config),
  });
}
