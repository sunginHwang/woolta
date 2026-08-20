'use client';

import { useMemo } from 'react';
import { useMemoStore } from '../stores/useMemoStore';

/**
 * 메모 목록을 최근 수정 순으로 반환한다.
 */
export const useMemoList = () => {
  const memos = useMemoStore((state) => state.memos);

  return useMemo(() => [...memos].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)), [memos]);
};
