import { useSuspenseQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { getData } from '../../../../utils/api';
import { AccountBookCategoryType } from './useAccountBookCategories';

export interface AccountBookDetail {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
    type: AccountBookCategoryType;
    createdAt: Dayjs;
    updatedAt: Dayjs;
  };
  type: AccountBookCategoryType;
  isRegularExpenditure: boolean;
  amount: number;
  memo?: string;
  registerDateTime: Dayjs;
}

export const ACCOUNT_BOOK_QUERY_KEY = 'getAccountBook';

/*
 * 가계부 상세 조회
 * */
export const fetchAccountBookDetail = async (id: string | null) => {
  if (!id) {
    return null;
  }

  const { data } = await getData<AccountBookDetail>(`/account-books/${id}`);
  const accountBook: AccountBookDetail = {
    ...data,
    category: {
      ...data.category,
      createdAt: dayjs(data.category.createdAt),
      updatedAt: dayjs(data.category.updatedAt),
    },
    registerDateTime: dayjs(data.registerDateTime),
  };
  return accountBook;
};

export const useAccountBookDetail = (id: string | null) => {
  const { data, ...rest } = useSuspenseQuery(getAccountBookFetchInfo(id));

  return {
    accountBookDetail: data,
    ...rest,
  };
};

export function getAccountBookFetchInfo(id: string | null) {
  return {
    queryKey: [ACCOUNT_BOOK_QUERY_KEY, id],
    queryFn: () => fetchAccountBookDetail(id),
    enabled: !!id,
  };
}
