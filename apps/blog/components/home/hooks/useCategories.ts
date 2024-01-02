import { useSuspenseQuery } from '@tanstack/react-query';
import { ICategory } from 'apps/blog/types/post/ICategory';
import { getData } from 'apps/blog/utils/api';

const CATEGORIES_QUERY_KEY: string = 'getCategories';

export const allCategory: ICategory = {
  value: -1,
  label: '전체',
};

export async function fetchCategories() {
  const { data } = await getData<ICategory[]>(`/post/categories`);
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
