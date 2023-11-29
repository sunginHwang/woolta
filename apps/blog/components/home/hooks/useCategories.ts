import { useQuery } from '@tanstack/react-query';
import { ICategory } from 'apps/blog/types/post/ICategory';
import { getData } from 'apps/blog/utils/apiCall';

const CATEGORIES_QUERY_KEY: string = 'getCategories';

export const allCategory: ICategory = {
  value: '-1',
  label: '전체',
};

export async function fetchCategories() {
  const categories = await getData<ICategory[]>(`/post/categories`);
  return categories;
}

export const useCategories = () => {
  const { data, ...rest } = useQuery({ queryKey: [CATEGORIES_QUERY_KEY], queryFn: fetchCategories });

  const defaultCategories = data ?? [];

  return {
    categories: [allCategory, ...defaultCategories],
    categoriesExceptAll: defaultCategories,
    ...rest,
  };
};
