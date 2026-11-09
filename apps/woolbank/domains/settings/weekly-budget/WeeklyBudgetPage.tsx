'use client';

import { withSuspense } from '@common';
import { Skeleton } from '@wds';
import { useSaveWeeklyBudgetMutation, useWeeklyBudget } from '@woolta/woolbank-features';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import { useToast } from '../../../hooks/useToast';
import { WeeklyBudgetView } from './WeeklyBudgetView';

/**
 * 설정 › 주간 예산 — 저장하면 예산·사용 현황 쿼리가 무효화돼 가계부 홈에 즉시 반영된다.
 * @component
 */
const WeeklyBudgetPage = () => {
  const router = useRouter();
  const { onToast } = useToast();
  const { amount } = useWeeklyBudget();
  const { isShareUser } = useUserInfo();
  const saveMutation = useSaveWeeklyBudgetMutation();

  const handleSave = (nextAmount: number) => {
    saveMutation.mutate(
      { input: { amount: nextAmount } },
      {
        onSuccess: () => {
          onToast('주간 예산을 저장했어요.');
          router.back();
        },
        onError: () => onToast('다시 시도해 주세요.'),
      },
    );
  };

  return (
    <WeeklyBudgetView
      // 서버 값이 바뀌면(다른 기기에서 저장 등) 입력 초깃값도 다시 잡는다
      key={amount}
      initialAmount={amount}
      isSaving={saveMutation.isPending}
      isShareUser={isShareUser}
      onSave={handleSave}
      onBackClick={router.back}
    />
  );
};

export default withSuspense(WeeklyBudgetPage, <Skeleton.List rows={4} />);
