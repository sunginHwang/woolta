'use client';

import { type QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { getData } from '../api';
import { CATEGORIES_QUERY_KEY } from '../query-keys';
import type { ICategory } from '../types/ICategory';

export const allCategory: ICategory = {
  value: -1,
  label: '최신',
};

export async function fetchCategories() {
  const { data } = await getData<ICategory[]>('/post/categories');
  return data;
}

export const useCategories = () => {
  const { data, ...rest } = useSuspenseQuery({ queryKey: [CATEGORIES_QUERY_KEY], queryFn: fetchCategories });

  const defaultCategories = data ?? [];

  return {
    categories: [allCategory, ...defaultCategories],
    categoriesExceptAll: defaultCategories,
    ...rest,
  };
};

export function prefetchCategories(queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: fetchCategories,
  });
}
