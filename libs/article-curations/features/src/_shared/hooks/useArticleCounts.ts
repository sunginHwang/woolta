'use client';

import { useMemo } from 'react';
import { useArticleStore } from '../stores/useArticleStore';
import { useWeeklyCuration } from './useWeeklyCuration';

/** 사이드바 뱃지에 표시할 리스트별 아티클 개수를 반환한다. */
export const useArticleCounts = () => {
  const articleList = useArticleStore((state) => state.articleList);
  const { curatedArticleIds } = useWeeklyCuration();

  return useMemo(() => {
    const byCategory: Record<string, number> = {};
    articleList.forEach((article) => {
      byCategory[article.categoryId] = (byCategory[article.categoryId] ?? 0) + 1;
    });

    return {
      all: articleList.length,
      curation: curatedArticleIds.length,
      byCategory,
    };
  }, [articleList, curatedArticleIds]);
};
