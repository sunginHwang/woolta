'use client';

import { useMemo } from 'react';
import { useArticleStore } from '../stores/useArticleStore';

/** 카테고리 목록을 정렬 순서대로 반환한다. */
export const useCategoryList = () => {
  const categoryList = useArticleStore((state) => state.categoryList);
  return useMemo(() => [...categoryList].sort((a, b) => a.order - b.order), [categoryList]);
};
