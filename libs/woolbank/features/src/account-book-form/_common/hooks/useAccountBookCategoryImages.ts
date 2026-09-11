'use client';

import { useQuery } from '@tanstack/react-query';
import {
  type AccountBookCategoryImage,
  accountBookCategoryImageListKey,
  fetchAccountBookCategoryImages,
} from '../../../_shared/hooks/accountBookCategoryApi';

export type { AccountBookCategoryImage };

export const useAccountBookCategoryImages = () => {
  const { data, ...rest } = useQuery({
    queryKey: accountBookCategoryImageListKey(),
    queryFn: () => fetchAccountBookCategoryImages(),
  });

  return {
    accountBookCategoryImages: data ?? [],
    ...rest,
  };
};
