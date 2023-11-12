import { useQuery } from '@tanstack/react-query';
import { BLOG_API } from 'apps/blog/config';
import { ICategory } from 'apps/blog/types/post/ICategory';
import apiCall from 'apps/blog/utils/apiCall';

const CATEGORIES_QUERY_KEY: string = 'getCategories';

type ApiRes<T> = {
  data: T;
  code: number;
};

const allCategory: ICategory = {
  value: 'ALL',
  label: '전체',
};

export async function fetchCategories() {
  const { data } = await apiCall.get<ApiRes<ICategory[]>>(`${BLOG_API}/post/categories`);
  return [allCategory, ...data.data];
}

export const useCategories = () => {
  const { data, ...rest } = useQuery({ queryKey: [CATEGORIES_QUERY_KEY], queryFn: fetchCategories });

  return {
    categories: data ?? [],
    ...rest,
  };
};
