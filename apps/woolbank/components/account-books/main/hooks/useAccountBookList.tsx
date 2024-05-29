'use client';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import groupBy from 'lodash-es/groupBy';
import { getData } from '../../../../utils/api';
import { selectedAccountBookDateAtom } from '../AccountList/store';

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
export const fetchAccountBookList = async (searchDate: string) => {
  const date = new Date(searchDate);
  const { data } = await getData<AccountBook[]>(`/account-books?dateTime=${date}`);

  return data.map((item) => {
    return {
      ...item,
      registerDateTime: new Date(item.registerDateTime),
    };
  });
};

export const useAccountBookList = () => {
  const queryClient = useQueryClient();
  const selectedAccountBookDate = useAtomValue(selectedAccountBookDateAtom);
  const queryKey = getQueryKey(selectedAccountBookDate);

  const { data, ...rest } = useSuspenseQuery<AccountBook[]>({
    queryKey,
    queryFn: () => fetchAccountBookList(selectedAccountBookDate),
  });
  const accountBookList = data ?? [];

  const accountBookListGroupByDay = getAccountListGroupByDay(accountBookList);
  const totalIncomeAmount = getTotalAmountbyType(accountBookList, 'income');
  const totalExpenditureAmount = getTotalAmountbyType(accountBookList, 'expenditure');

  const set = (accountBookList: AccountBook[]) => {
    queryClient.setQueryData<AccountBook[]>(queryKey, accountBookList);
  };

  const add = (accountBook: AccountBook) => {
    queryClient.setQueryData<AccountBook[]>(queryKey, (prev = []) => [...prev, accountBook]);
  };

  const update = (accountBook: AccountBook) => {
    queryClient.setQueryData<AccountBook[]>(queryKey, (prev = []) => {
      return prev.map((item) => (accountBook.id === item.id ? accountBook : item));
    });
  };

  const remove = (removeId: number) => {
    queryClient.setQueryData<AccountBook[]>(queryKey, (prev = []) => {
      return prev.filter((item) => removeId !== item.id);
    });
  };

  return {
    accountBookList,
    totalIncomeAmount,
    totalExpenditureAmount,
    accountBookListGroupByDay,
    set,
    add,
    update,
    remove,
    ...rest,
  };
};

/**
 * 가계부 리스트의 총합금액 구하기 (소비, 지출 )
 */
function getDayAmountInfo(accountBookList: AccountBook[]) {
  return accountBookList.reduce(
    (prev, item) => {
      if (item.type === 'income') {
        prev.incomeAmount += item.amount;
      } else {
        prev.expenditureAmount += item.amount;
      }
      return prev;
    },
    { incomeAmount: 0, expenditureAmount: 0 },
  );
}

function getAccountListGroupByDay(accountBookList: AccountBook[]) {
  const accountBookListGroupDays = groupBy(accountBookList, (item) => dayjs(item.registerDateTime).format('D'));
  return Object.entries(accountBookListGroupDays)
    .map(([days, accountBookList]) => {

      const { incomeAmount, expenditureAmount } = getDayAmountInfo(accountBookList);

      return {
        accountBookList,
        expenditureAmount,
        incomeAmount,
        totalAmount: incomeAmount - expenditureAmount,
        days,
      };
    })
    .reverse();
}

function getTotalAmountbyType(accountBookList: AccountBook[], type: AcccountBookType) {
  return accountBookList.reduce((prev, item) => {
    if (item.type === type) {
      return prev + item.amount;
    }

    return prev;
  }, 0);
}

export function getQueryKey(selectedDate: string) {
  return [ACCOUNT_BOOK_LIST_QUERY_KEY, selectedDate];
}
