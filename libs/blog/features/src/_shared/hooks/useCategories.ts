// prefetchCategories 를 RSC 에서 호출해야 하므로 'use client' 를 붙이지 않는다.
import { type QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useCategoryListQuery } from '../api/gql.generated';
import { CATEGORIES_QUERY_KEY } from '../query-keys';
import type { ICategory } from '../types/ICategory';

export const allCategory: ICategory = {
  value: -1,
  label: '최신',
};

// 서버 Category 는 { value, label } 로 ICategory 와 형태가 같다.
const fetchCategories = async (): Promise<ICategory[]> => {
  const data = await useCategoryListQuery.fetcher()();

  return data.categoryList.itemList;
};

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
