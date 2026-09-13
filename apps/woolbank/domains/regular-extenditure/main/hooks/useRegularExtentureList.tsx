'use client';

import { useQueryClient } from '@tanstack/react-query';
import { regularExpenditureListKey, useDeleteRegularExpenditureMutation } from '@woolta/woolbank-features';
import { useRegularExtentureListQuery } from './useRegularExtentureListQuery';

export const useRegularExtentureList = () => {
  const queryClient = useQueryClient();
  const { regularExpenditureTypeList, ...rest } = useRegularExtentureListQuery();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: regularExpenditureListKey() });

  const removeeRegularExtentureMutate = useDeleteRegularExpenditureMutation({ onSuccess: invalidate });

  const flatRegularExpenditureTypeList = regularExpenditureTypeList.flatMap((item) => item.list);
  const totalAmount = flatRegularExpenditureTypeList.reduce((acc, item) => acc + item.amount, 0);

  /**
   * 레거시는 setQueryData 로 목록에서 항목을 직접 들어냈다.
   * 삭제 성공 시 무효화하면 서버가 정본이 되므로 손으로 재조립할 필요가 없다
   * (그룹이 비면 서버가 그룹째 빼준다).
   */
  const removeRegularExtentureItem = () => invalidate();

  return {
    removeeRegularExtentureMutate,
    removeRegularExtentureItem,
    regularExpenditureTypeList,
    flatRegularExpenditureTypeList,
    totalAmount,
    ...rest,
  };
};
