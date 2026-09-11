'use client';

import {
  useAddArticleToCurationMutation,
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useRemoveArticleFromCurationMutation,
} from '../api/gql.generated';
import type { ArticleSeo } from '../types';
import { useArticlesCache } from './useArticles';
import { useCurationListCache } from './useWeeklyCuration';

interface AddArticleInput {
  /** 소속 카테고리 id */
  categoryId: string;
  /** 제목 */
  title: string;
  /** 아티클 링크 */
  url: string;
  /** 링크에서 수집한 SEO 메타 (없으면 생략) */
  seo?: ArticleSeo;
}

/** 아티클을 등록한다. */
export const useAddArticle = () => {
  const { invalidateArticles } = useArticlesCache();

  const { mutateAsync, isPending } = useCreateArticleMutation({
    onSuccess: () => invalidateArticles(),
  });

  return {
    addArticle: (input: AddArticleInput) => mutateAsync({ input }),
    isAdding: isPending,
  };
};

/**
 * 아티클을 삭제한다.
 * 서버가 큐레이션에서도 함께 빼므로 큐레이션 목록까지 무효화한다.
 */
export const useRemoveArticle = () => {
  const { invalidateArticles } = useArticlesCache();
  const { invalidateCurationList } = useCurationListCache();

  const { mutate, isPending } = useDeleteArticleMutation({
    onSuccess: () => {
      invalidateArticles();
      invalidateCurationList();
    },
  });

  return {
    removeArticle: (id: string) => mutate({ input: { id } }),
    isRemoving: isPending,
  };
};

/**
 * 이번 주 큐레이션에 아티클을 넣거나 뺀다.
 * 정원(WEEKLY_CURATION_LIMIT) 판정은 호출부(useWeeklyCuration.isFull)가 이미 하고 있어
 * 여기서는 선정 여부에 따라 add/remove 만 고른다.
 */
export const useToggleCuration = () => {
  const { invalidateCurationList } = useCurationListCache();

  const addMutation = useAddArticleToCurationMutation({ onSuccess: () => invalidateCurationList() });
  const removeMutation = useRemoveArticleFromCurationMutation({ onSuccess: () => invalidateCurationList() });

  const toggleCuration = ({
    weekKey,
    articleId,
    isCurated,
  }: {
    weekKey: string;
    articleId: string;
    isCurated: boolean;
  }) => {
    const variables = { input: { weekKey, articleId } };

    if (isCurated) {
      removeMutation.mutate(variables);
      return;
    }
    addMutation.mutate(variables);
  };

  return {
    toggleCuration,
    isToggling: addMutation.isPending || removeMutation.isPending,
  };
};
