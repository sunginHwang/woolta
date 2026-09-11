'use client';

import {
  useCreateTodoCategoryMutation,
  useDeleteTodoCategoryMutation,
  useUpdateTodoCategoryMutation,
} from '../api/gql.generated';
import { useCategoryListCache } from './useCategoryList';
import { useTodosCache } from './useTodos';

/**
 * 카테고리를 추가한다.
 * 호출부가 생성된 카테고리로 이동해야 해서 생성 결과를 await 할 수 있게 mutateAsync 를 노출한다.
 */
export const useAddCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();

  const { mutateAsync, isPending } = useCreateTodoCategoryMutation({
    onSuccess: () => invalidateCategoryList(),
  });

  return {
    addCategory: async (name: string) => {
      const { createTodoCategory } = await mutateAsync({ input: { name } });
      return createTodoCategory.id;
    },
    isAdding: isPending,
  };
};

/** 카테고리 이름을 변경한다. */
export const useUpdateCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();

  const { mutate, isPending } = useUpdateTodoCategoryMutation({
    onSuccess: () => invalidateCategoryList(),
  });

  return {
    updateCategory: (id: string, name: string) => mutate({ input: { id, name } }),
    isUpdating: isPending,
  };
};

/**
 * 카테고리를 삭제한다.
 * 소속 할 일의 categoryId 가 서버에서 바뀌므로 할 일 목록도 함께 무효화한다.
 */
export const useRemoveCategory = () => {
  const { invalidateCategoryList } = useCategoryListCache();
  const { invalidateTodos } = useTodosCache();

  const { mutateAsync, isPending } = useDeleteTodoCategoryMutation({
    onSuccess: () => {
      invalidateCategoryList();
      invalidateTodos();
    },
  });

  return {
    // 삭제 후 목록 경로로 이동해야 해서 호출부가 완료를 기다릴 수 있게 한다.
    removeCategory: (id: string) => mutateAsync({ input: { id } }),
    isRemoving: isPending,
  };
};
