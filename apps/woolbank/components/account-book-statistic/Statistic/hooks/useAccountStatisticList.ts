import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useAtomValue } from 'jotai';
import { getData } from '../../../../utils/api';
import { AccountBookStatisticFilterAtom, AccountStatisticFilter, allVisibilityStatisticAtom } from '../store';

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
export const fetchAccountBookStatistics = async (filter: AccountStatisticFilter) => {
  const params = {
    type: filter.type,
    startDate: filter.startDate.format('YYYY-MM-DD HH:mm:ss'),
    endDate: filter.endDate.format('YYYY-MM-DD HH:mm:ss'),
  };

  const response = await getData<AccountBookStatistic[]>('account-books/statistics', {
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

export const useAccountStatisticList = () => {
  const allVisibilityStatistic = useAtomValue(allVisibilityStatisticAtom);
  const AccountBookStatisticFilter = useAtomValue(AccountBookStatisticFilterAtom);
  const queryKey = getQueryKey(AccountBookStatisticFilter);

  const { data, ...rest } = useSuspenseQuery<AccountBookStatistic[]>({
    queryKey,
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
