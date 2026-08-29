import type { JSONContent } from '@tiptap/core';
import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import type { Memo } from '../types';

export const EMPTY_MEMO_CONTENT: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] };

const createMemoId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `memo-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

export const useMemoStore = create(
  persist(
    combine(
      {
        memos: [] as Memo[],
        selectedMemoId: null as string | null,
      },
      (set) => ({
        createMemo: () => {
          const now = new Date().toISOString();
          const memo: Memo = {
            id: createMemoId(),
            title: '',
            content: EMPTY_MEMO_CONTENT,
            createdAt: now,
            updatedAt: now,
          };

          set((state) => ({ memos: [memo, ...state.memos], selectedMemoId: memo.id }));
          return memo.id;
        },
        updateMemo: (id: string, patch: Partial<Pick<Memo, 'title' | 'content'>>) => {
          set((state) => ({
            memos: state.memos.map((memo) =>
              memo.id === id ? { ...memo, ...patch, updatedAt: new Date().toISOString() } : memo,
            ),
          }));
        },
        removeMemo: (id: string) => {
          set((state) => ({
            memos: state.memos.filter((memo) => memo.id !== id),
            selectedMemoId: state.selectedMemoId === id ? null : state.selectedMemoId,
          }));
        },
        selectMemo: (id: string | null) => {
          set({ selectedMemoId: id });
        },
      }),
    ),
    {
      name: 'woolta:memos',
    },
  ),
);
