'use client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { deleteData, getData, postData, putData } from '../../../_shared/api';
import { useAccountBookList } from '../../../_shared/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../../../_shared/stores/accountbookDate';
import { useToast } from '../../../_shared/toast/useToast';
import { AccountBookCategoryType } from './useAccountBookCategories';
import { AccountBookSaveForm, ScheduledPaymentType } from './useAccountBookForm';

export interface AccountBookDetail {
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
    type: AccountBookCategoryType;
    accountBookCategoryImage: {
      imageUrl: string;
    };
    createdAt: Date;
    updatedAt: Date;
  };
  type: AccountBookCategoryType;
  isRegularExpenditure: boolean;
  isDisabledBudget: boolean;
  amount: number;
  memo?: string;
  registerDateTime: Date;
  scheduledPaymentType?: ScheduledPaymentType;
  scheduledPaymentDay?: number;
  installmentMonth?: number;
}

export const ACCOUNT_BOOK_QUERY_KEY = 'getAccountBook';

export const deleteAccountBook = async (accountBookId: string) => {
  const { data } = await deleteData<number>(`account-books/${accountBookId}`);
  return data;
};

export const addAccountBook = async (accountBookForm: AccountBookSaveForm) => {
  const { title, type, amount, memo, category, isDisabledBudget, scheduledPaymentType, scheduledPaymentDay, installmentMonth } =
    accountBookForm;
  const requestParam = {
    title,
    registerDateTime: accountBookForm.registerDateTime.toDate(),
    type,
    amount,
    memo,
    isDisabledBudget,
    scheduledPaymentType,
    scheduledPaymentDay,
    installmentMonth,
    categoryId: category.id,
  };
  const { data } = await postData<AccountBookDetail>('account-books', requestParam);
  return data;
};

export const updateAccountBook = async (accountBookForm: AccountBookSaveForm) => {
  const { title, type, amount, memo, category, id, isDisabledBudget } = accountBookForm;
  const requestParam = {
    title,
    registerDateTime: accountBookForm.registerDateTime.toDate(),
    type,
    amount,
    memo,
    isDisabledBudget,
    categoryId: category.id,
  };
  const { data } = await putData<AccountBookDetail>(`account-books/${id}`, requestParam);
  return convertDate(data);
};

export const fetchAccountBookDetail = async (id: string | null) => {
  if (!id) {
    return null;
  }
  const { data } = await getData<AccountBookDetail>(`/account-books/${id}`);
  return convertDate(data);
};

export const useAccountBookDetail = (id: string | null) => {
  const { back } = useRouter();
  const { onToast } = useToast();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({ mutationFn: deleteAccountBook });
  const updateMutation = useMutation({ mutationFn: updateAccountBook });
  const addMutation = useMutation({ mutationFn: addAccountBook });
  const selectedAccountBookDate = useAtomValue(selectedAccountBookDateAtom);

  const { data, ...rest } = useSuspenseQuery(getAccountBookFetchInfo(id));
  const { remove: removeAccountBookList, add: addAccountBookItem, update: updateAccountBookList } = useAccountBookList();

  // BUG FIX: removed console.log + early return that made this unreachable
  const upsertAccountBook = (accountBookForm: AccountBookSaveForm) => {
    const isSaveAction = typeof accountBookForm.id !== 'number';

    if (isSaveAction) {
      addMutation.mutate(accountBookForm, {
        onSuccess: (accountBook: AccountBookDetail) => {
          const registerDateMonth = dayjs(convertDate(accountBook).registerDateTime).format('YYYY-MM');
          if (registerDateMonth === selectedAccountBookDate) {
            addAccountBookItem(convertDate(accountBook));
          }
          back();
        },
        onError: () => onToast('다시 시도해 주세요.'),
      });
    } else {
      updateMutation.mutate(accountBookForm, {
        onSuccess: (updatedAccountBook) => {
          queryClient.setQueryData<AccountBookDetail>(getQueryKey(id), () => convertDate(updatedAccountBook));
          updateAccountBookList(convertDate(updatedAccountBook));
          onToast('수정되었습니다.');
        },
        onError: () => onToast('다시 시도해 주세요.'),
      });
    }
  };

  const removeAccountBook = async (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        removeAccountBookList(Number(id));
        queryClient.setQueryData(getQueryKey(id), () => null);
        onToast('정상적으로 삭제되었습니다.');
        back();
      },
      onError: () => onToast('다시 시도해 주세요.'),
    });
  };

  return {
    accountBookDetail: data,
    upsertAccountBook,
    removeAccountBook,
    ...rest,
  };
};

function getQueryKey(id: string | null) {
  return [ACCOUNT_BOOK_QUERY_KEY, id];
}

export function getAccountBookFetchInfo(id: string | null) {
  return {
    queryKey: getQueryKey(id),
    queryFn: () => fetchAccountBookDetail(id),
    enabled: !!id,
  };
}

function convertDate(accountBook: AccountBookDetail) {
  return {
    ...accountBook,
    category: {
      ...accountBook.category,
      createdAt: new Date(accountBook.category.createdAt),
      updatedAt: new Date(accountBook.category.updatedAt),
    },
    registerDateTime: new Date(accountBook.registerDateTime),
  };
}