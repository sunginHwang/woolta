'use client';

import { useMemo } from 'react';
import { useTodoStore } from '../stores/useTodoStore';

/** 카테고리 목록을 정렬 순서대로 반환한다. */
export const useCategoryList = () => {
  const categories = useTodoStore((state) => state.categories);
  return useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories]);
};
