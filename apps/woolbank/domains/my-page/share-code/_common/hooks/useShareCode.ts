'use client';

import { useShareCodeOptional, useUpsertShareCode } from '@woolta/user-features';
import { useToast } from '../../../../../hooks/useToast';

export const useShareCode = () => {
  const { onToast } = useToast();
  const { shareCode, refetch, isLoading } = useShareCodeOptional();
  const { upsertShareCode, isUpserting } = useUpsertShareCode();

  const createShareCode = async () => {
    try {
      await upsertShareCode();
      onToast('초대코드 생성이 완료되었습니다.');
      await refetch();
    } catch {
      onToast('잠시후 다시 시도해 주세요.');
    }
  };

  return {
    shareCode,
    isExistShareCode: shareCode !== '',
    createShareCode,
    isUpserting,
    isLoading,
    refetch,
  };
};
