'use client';

import { withSuspense } from '@common';
import { useRouter } from 'next/navigation';
import { useConfirm } from '../../../components/Confirm/ConfirmContext';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import { useToast } from '../../../hooks/useToast';
import { useRegularExtentureList } from './hooks/useRegularExtentureList';
import type { RegularExpenditure as RegularExpenditureItem } from './hooks/useRegularExtentureListQuery';
import RegularExpenditureSkeleton from './RegularExpenditureSkeleton';
import { RegularExpenditureView } from './RegularExpenditureView';

/**
 * 정기 지출 리스트 — 데이터·삭제 확인을 묶어 RegularExpenditureView 에 넘긴다.
 * @component
 */
export const RegularExpenditure = withSuspense(
  () => {
    const router = useRouter();
    const { isShareUser } = useUserInfo();
    const { onToast } = useToast();
    const { openConfirm, setConfirmLoading } = useConfirm();
    const { regularExpenditureTypeList, removeeRegularExtentureMutate } = useRegularExtentureList();

    const handleDelete = async ({ id }: RegularExpenditureItem) => {
      const isConfirm = await openConfirm({ message: '정기지출을 삭제할까요?', useAutoClose: false });

      if (!isConfirm) {
        return;
      }

      setConfirmLoading(true);
      // 목록 갱신은 훅이 무효화로 처리한다 — 화면은 결과 안내만 한다
      removeeRegularExtentureMutate.mutate(
        { input: { id } },
        {
          onSuccess: () => onToast('삭제 되었습니다.'),
          onError: () => onToast('다시 시도해 주세요.'),
          onSettled: () => setConfirmLoading(false),
        },
      );
    };

    return (
      <RegularExpenditureView
        groups={regularExpenditureTypeList}
        isShareUser={isShareUser}
        onAddClick={() => router.push('/regular-extenditure/save')}
        onDelete={handleDelete}
      />
    );
  },
  <RegularExpenditureSkeleton />,
);
