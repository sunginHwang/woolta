'use client';

import {
  useCreateArticleCategoryMutation,
  useDeleteArticleCategoryMutation,
  useUpdateArticleCategoryMutation,
} from '../api/gql.generated';
import { useArticlesCache } from './useArticles';
import { useCategoryListCache } from './useCategoryList';
import { useCurationListCache } from './useWeeklyCuration';

/**
 * 카테고리를 추가한다.
 * 호출부가 생성된 카테고리로 이동해야 해서 생성 결과를 await 할 수 있게 mutateAsync 를 노출한다.
 */
export const useAddCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();

  const { mutateAsync, isPending } = useCreateArticleCategoryMutation({
    onSuccess: () => invalidateCategoryList(),
  });

  return {
    addCategory: async (name: string) => {
      const { createArticleCategory } = await mutateAsync({ input: { name } });
      return createArticleCategory.id;
    },
    isAdding: isPending,
  };
};

/** 카테고리 이름을 변경한다. */
export const useUpdateCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();

  const { mutate, isPending } = useUpdateArticleCategoryMutation({
    onSuccess: () => invalidateCategoryList(),
  });

  return {
    updateCategory: (id: string, name: string) => mutate({ input: { id, name } }),
    isUpdating: isPending,
  };
};

/**
 * 카테고리를 삭제한다.
 * 서버가 소속 아티클과 그 아티클의 큐레이션까지 함께 지우므로 세 캐시를 모두 무효화한다.
 */
export const useRemoveCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();
  const { invalidateArticles } = useArticlesCache();
  const { invalidateCurationList } = useCurationListCache();

  const { mutateAsync, isPending } = useDeleteArticleCategoryMutation({
    onSuccess: () => {
      invalidateCategoryList();
      invalidateArticles();
      invalidateCurationList();
    },
  });

  return {
    // 삭제 후 목록 경로로 이동해야 해서 호출부가 완료를 기다릴 수 있게 한다.
    removeCategory: (id: string) => mutateAsync({ input: { id } }),
    isRemoving: isPending,
  };
};
