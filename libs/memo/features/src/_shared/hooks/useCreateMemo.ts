'use client';

import { useCreateMemoMutation } from '../api/gql.generated';
import { useMemoStore } from '../stores/useMemoStore';
import { useMemoDetailCache } from './useMemoDetail';
import { useMemoListCache } from './useMemoList';

/**
 * 빈 메모를 서버에 생성하고 곧바로 선택 상태로 만든다.
 * 응답으로 받은 메모를 상세 캐시에 심어 두어 생성 직후 재조회 없이 편집을 시작할 수 있다.
 */
export const useCreateMemo = () => {
  const selectMemo = useMemoStore((state) => state.selectMemo);
  const { setMemoDetail } = useMemoDetailCache();
  const { invalidateMemoList } = useMemoListCache();

  const { mutate, isPending } = useCreateMemoMutation({
    onSuccess: ({ createMemo }) => {
      setMemoDetail(createMemo);
      invalidateMemoList();
      selectMemo(createMemo.id);
    },
  });

  return {
    createMemo: () => mutate({}),
    isCreating: isPending,
  };
};
