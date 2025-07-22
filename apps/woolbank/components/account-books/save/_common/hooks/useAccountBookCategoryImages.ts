import { useQuery } from '@tanstack/react-query';
import { getData } from '../../../../../utils/api';

export interface AccountBookCategoryImage {
  id: number;
  name: string;
  imageUrl: string;
}

export const ACCOUNT_BOOK_CATEGORY_IMAGES_QUERY_KEY = 'getAccountBookCategoryImages';

export const fetchAccountBookCategoryImages = async () => {
  const { data } = await getData<AccountBookCategoryImage[]>('/account-book-category-images');
  return data;
};

export const useAccountBookCategoryImages = () => {
  const { data, ...rest } = useQuery({
    queryKey: [ACCOUNT_BOOK_CATEGORY_IMAGES_QUERY_KEY],
    queryFn: fetchAccountBookCategoryImages,
  });

  return {
    accountBookCategoryImages: data ?? [],
    ...rest,
  };
};
