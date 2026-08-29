'use client';

import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getData, postData } from '../../../_shared/api';
import { useToast } from '../../../_shared/toast/useToast';
import type { AccountBookCategoryType } from '../../../_shared/utils/account-books';

export type { AccountBookCategoryType };

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

export interface AccountBookCategoryForm {
  name: string;
  type: AccountBookCategoryType;
  useStatistic: boolean;
  imageId: number;
}

export interface SaveAccountBookCategoryForm extends AccountBookCategoryForm {
  onSuccessCb?: () => void;
}

export const ACCOUNT_BOOK_CATEGORIES_QUERY_KEY = 'getAccountBookCategories';

export const fetchAccountBookCategories = async () => {
  const { data } = await getData<AccountBookCategory[]>('/account-book-categories');
  return data;
};

export const addAccountBookCategory = async ({
  name,
  type,
  imageId,
  useStatistic,
}: AccountBookCategoryForm): Promise<AccountBookCategory> => {
  const { data } = await postData<AccountBookCategory>('account-book-categories', {
    type,
    useStatistic,
    name,
    imageId,
  });
  return data;
};

export const useAccountBookCategories = () => {
  const { onToast } = useToast();
  const { data, refetch, ...rest } = useSuspenseQuery({
    queryKey: [ACCOUNT_BOOK_CATEGORIES_QUERY_KEY],
    queryFn: fetchAccountBookCategories,
  });
  const saveCategoryMutation = useMutation({ mutationFn: addAccountBookCategory });

  const saveAccountBookCategory = ({ onSuccessCb, name, type, imageId, useStatistic }: SaveAccountBookCategoryForm) => {
    saveCategoryMutation.mutate(
      { name, type, imageId, useStatistic },
      {
        onSuccess: () => {
          onToast('카테고리가 생성되었습니다.');
          refetch();
          onSuccessCb?.();
        },
        onError: () => onToast('다시 시도해 주세요.'),
      },
    );
  };

  return {
    accountBookCategories: data ?? [],
    saveAccountBookCategory,
    saveLoading: saveCategoryMutation.isPending,
    refetch,
    ...rest,
  };
};
