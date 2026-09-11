'use client';

import { useDeleteMemoMutation } from '../api/gql.generated';
import { useMemoStore } from '../stores/useMemoStore';
import { useMemoDetailCache } from './useMemoDetail';
import { useMemoListCache } from './useMemoList';

/**
 * 메모를 서버에서 삭제하고, 삭제된 메모가 선택 중이었다면 선택을 해제한다.
 */
export const useDeleteMemo = () => {
  const { removeMemoDetail } = useMemoDetailCache();
  const { invalidateMemoList } = useMemoListCache();

  const { mutate, isPending } = useDeleteMemoMutation({
    onSuccess: (_data, { input }) => {
      removeMemoDetail(input.id);
      invalidateMemoList();

      // 콜백 시점의 최신 선택을 읽어야 하므로 구독 값 대신 getState 를 쓴다.
      const { selectedMemoId, selectMemo } = useMemoStore.getState();
      if (selectedMemoId === input.id) {
        selectMemo(null);
      }
    },
  });

  return {
    deleteMemo: (id: string) => mutate({ input: { id } }),
    isDeleting: isPending,
  };
};
