'use client';

import { useMemoStore } from '../stores/useMemoStore';

/**
 * 현재 선택된 메모를 반환한다. 선택이 없으면 null.
 */
export const useSelectedMemo = () => {
  const memos = useMemoStore((state) => state.memos);
  const selectedMemoId = useMemoStore((state) => state.selectedMemoId);

  return memos.find((memo) => memo.id === selectedMemoId) ?? null;
};
