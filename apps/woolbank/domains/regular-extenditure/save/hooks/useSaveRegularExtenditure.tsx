'use client';

import { useQueryClient } from '@tanstack/react-query';
import { regularExpenditureListKey, useCreateRegularExpenditureMutation } from '@woolta/woolbank-features';
import { useRouter } from 'next/navigation';
import { useToast } from '../../../../hooks/useToast';
import type { RegularExtenditureForm } from './useRegularExtenditureForm';

export const useSaveRegularExtenditure = () => {
  const { back } = useRouter();
  const { onToast } = useToast();
  const queryClient = useQueryClient();

  const addMutation = useCreateRegularExpenditureMutation({
    // 목록을 직접 조작하지 않고 서버를 정본으로 삼는다
    onSuccess: () => queryClient.invalidateQueries({ queryKey: regularExpenditureListKey() }),
  });

  const addRegularExpenditure = ({
    category,
    title,
    amount,
    regularDate,
    isAutoExpenditure,
  }: RegularExtenditureForm) => {
    addMutation.mutate(
      {
        // 카테고리 id 는 GraphQL ID(문자열)이고 서버 입력은 Int 다
        input: { title, amount, regularDate, isAutoExpenditure, categoryId: Number(category.id) },
      },
      {
        onSuccess: () => back(),
        onError: () => onToast('다시 시도해 주세요.'),
      },
    );
  };

  return {
    addRegularExpenditure,
  };
};
