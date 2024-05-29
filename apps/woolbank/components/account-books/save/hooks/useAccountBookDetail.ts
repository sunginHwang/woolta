import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/useToast';
import { deleteData, getData, postData, putData } from '../../../../utils/api';
import { selectedAccountBookDateAtom } from '../../main/AccountList/store';
import { useAccountBookList } from '../../main/hooks/useAccountBookList';
import { AccountBookSaveForm } from '../AccountBookForm/hooks/useAccountBookForm';
import { AccountBookCategoryType } from './useAccountBookCategories';

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
  amount: number;
  memo?: string;
  registerDateTime: Date;
}

export const ACCOUNT_BOOK_QUERY_KEY = 'getAccountBook';

/*
 * 가계부 삭제
 * */
export const deleteAccountBook = async (accountBookId: string) => {
  const { data } = await deleteData<number>(`account-books/${accountBookId}`);
  return data;
};

/*
 * 가계부 삭제
 * */
export const addAccountBook = async (accountBookForm: AccountBookSaveForm) => {
  const { title, type, amount, memo, category } = accountBookForm;
  const requestParam = {
    title,
    registerDateTime: accountBookForm.registerDateTime.toDate(),
    type,
    amount,
    memo,
    categoryId: category.id,
  };
  const { data } = await postData<AccountBookDetail>('account-books', requestParam);
  return data;
};

/*
 * 가계부 수정 api
 * */
export const updateAccountBook = async (accountBookForm: AccountBookSaveForm) => {
  const { title, type, amount, memo, category, id } = accountBookForm;
  const requestParam = {
    title,
    registerDateTime: accountBookForm.registerDateTime.toDate(),
    type,
    amount,
    memo,
    categoryId: category.id,
  };
  const { data } = await putData<AccountBookDetail>(`account-books/${id}`, requestParam);

  return convertDate(data);
};

/*
 * 가계부 상세 조회
 * */
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
  const {
    remove: removeAccountBookList,
    add: addAccountBookItem,
    update: updateAccountBookList,
  } = useAccountBookList();

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
          // 수정 후 상세 및 리스트 갱신
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
        // 삭제 후 상세 및 리스트 갱신
        removeAccountBookList(Number(id));
        queryClient.setQueryData(getQueryKey(id), () => {
          return null;
        });
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
