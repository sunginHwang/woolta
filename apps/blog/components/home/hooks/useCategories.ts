import { useQuery } from '@tanstack/react-query';
import { ICategory } from 'apps/blog/types/post/ICategory';
import apiCall, { ApiRes } from 'apps/blog/utils/apiCall';

const CATEGORIES_QUERY_KEY: string = 'getCategories';

export const allCategory: ICategory = {
  value: '-1',
  label: '전체',
};

export async function fetchCategories() {
  const { data } = await apiCall.get<ApiRes<ICategory[]>>(`/post/categories`);
  return data.data;
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
