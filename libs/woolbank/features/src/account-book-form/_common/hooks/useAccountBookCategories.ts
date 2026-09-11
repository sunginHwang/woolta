'use client';

import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCreateAccountBookCategoryMutation } from '../../../_shared/api/gql.generated';
import {
  type AccountBookCategory,
  accountBookCategoryListKey,
  fetchAccountBookCategories,
} from '../../../_shared/hooks/accountBookCategoryApi';
import { useToast } from '../../../_shared/toast/useToast';
import type { AccountBookCategoryType } from '../../../_shared/utils/account-books';

export type { AccountBookCategory, AccountBookCategoryType };

export interface AccountBookCategoryForm {
  name: string;
  type: AccountBookCategoryType;
  useStatistic: boolean;
  imageId: number;
}

export interface SaveAccountBookCategoryForm extends AccountBookCategoryForm {
  onSuccessCb?: () => void;
}

export const useAccountBookCategories = () => {
  const { onToast } = useToast();
  const queryClient = useQueryClient();
  const { data, refetch, ...rest } = useSuspenseQuery({
    queryKey: accountBookCategoryListKey(),
    queryFn: () => fetchAccountBookCategories(),
  });

  const saveCategoryMutation = useCreateAccountBookCategoryMutation({
    onSuccess: () => queryClient.invalidateQueries({ queryKey: accountBookCategoryListKey() }),
  });

  const saveAccountBookCategory = ({ onSuccessCb, name, type, imageId, useStatistic }: SaveAccountBookCategoryForm) => {
    saveCategoryMutation.mutate(
      // 서버는 이미지 식별자를 accountBookCategoryImageId(Int)로 받는다.
      // 조회 응답의 id 는 GraphQL ID(문자열)이므로 폼에서 number 로 좁혀 넘긴다.
      { input: { name, type, useStatistic, accountBookCategoryImageId: imageId } },
      {
        onSuccess: () => {
          onToast('카테고리가 생성되었습니다.');
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
