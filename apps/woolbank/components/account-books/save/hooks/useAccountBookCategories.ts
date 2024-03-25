import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useToast } from '../../../../hooks/useToast';
import { getData, postData } from '../../../../utils/api';

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

export interface AccountBookCategoryForm {
  name: string;
  type: AccountBookCategoryType;
  imageId: number;
}

export interface SaveAccountBookCategoryForm extends AccountBookCategoryForm {
  onSuccessCb?: () => void;
}

export const ACCOUNT_BOOK_CATEGORIES_QUERY_KEY = 'getAccountBookCategories';

/*
 * 가계부 카테고리 리스트 조회
 * */
export const fetchAccountBookCategories = async () => {
  const { data } = await getData<AccountBookCategory[]>('/account-book-categories');

  return data;
};

export const addAccountBookCategory = async ({
  name,
  type,
  imageId,
}: AccountBookCategoryForm): Promise<AccountBookCategory> => {
  const { data } = await postData<AccountBookCategory>('account-book-categories', { type, name, imageId });
  return data;
};

export const useAccountBookCategories = () => {
  const { onToast } = useToast();
  const { data, refetch, ...rest } = useSuspenseQuery({
    queryKey: [ACCOUNT_BOOK_CATEGORIES_QUERY_KEY],
    queryFn: fetchAccountBookCategories,
  });
  const saveCategoryMutation = useMutation({ mutationFn: addAccountBookCategory });

  const saveAccountBookCategory = ({ onSuccessCb, name, type, imageId }: SaveAccountBookCategoryForm) => {
    saveCategoryMutation.mutate(
      { name, type, imageId },
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
