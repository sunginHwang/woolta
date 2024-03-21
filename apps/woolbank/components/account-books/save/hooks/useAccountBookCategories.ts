import { useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../../../../utils/api';

// income: 수입, expenditure: 수출
export type AccountBookCategoryType = 'expenditure' | 'income';

export interface AccountBookCategory {
  id: number;
  name: string;
  type: AccountBookCategoryType;
  accountBookCategoryImage: {
    imageUrl: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const ACCOUNT_BOOK_CATEGORIES_QUERY_KEY = 'getAccountBookCategories';

/*
 * 가계부 카테고리 리스트 조회
 * */
export const fetchAccountBookCategories = async () => {
  const { data } = await getData<AccountBookCategory[]>('/account-book-categories');

  return data;
};

export const useAccountBookCategories = () => {
  const { data, ...rest } = useSuspenseQuery({
    queryKey: [ACCOUNT_BOOK_CATEGORIES_QUERY_KEY],
    queryFn: fetchAccountBookCategories,
  });

  return {
    accountBookCategories: data ?? [],
    ...rest,
  };
};
