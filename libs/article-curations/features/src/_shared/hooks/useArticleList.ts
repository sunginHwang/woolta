'use client';

import { useMemo } from 'react';
import { getCategoryIdFromListKey } from '../routes';
import { useArticleStore } from '../stores/useArticleStore';
import type { ArticleListKey } from '../types';
import { useWeeklyCuration } from './useWeeklyCuration';

/** 리스트 키에 해당하는 아티클 목록을 반환한다. (전체/카테고리는 최신순, 큐레이션은 선정순) */
export const useArticleList = (listKey: ArticleListKey) => {
  const articleList = useArticleStore((state) => state.articleList);
  const { curatedArticleIds } = useWeeklyCuration();

  return useMemo(() => {
    if (listKey === 'curation') {
      const articleById = new Map(articleList.map((article) => [article.id, article]));
      return curatedArticleIds
        .map((articleId) => articleById.get(articleId))
        .filter((article): article is NonNullable<typeof article> => article !== undefined);
    }

    const categoryId = getCategoryIdFromListKey(listKey);
    const filteredList =
      categoryId === null ? articleList : articleList.filter((article) => article.categoryId === categoryId);

    return [...filteredList].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [articleList, curatedArticleIds, listKey]);
};
