'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { CategoryChips } from '../_shared/category-chips/CategoryChips';
import { ChipsLoading } from '../_shared/chips/ChipsLoading';
import type { ChipItemWithLink } from '../_shared/chips/Item';
import { useBlogRoutes } from '../_shared/routes';
import { useHomeRouterProps } from './hooks/useHomeRouterProps';

export const PostCategories = () => {
  const { replace } = useRouter();
  const { categoryId } = useHomeRouterProps();
  const { basePath } = useBlogRoutes();

  const handleChipClick = (chip: ChipItemWithLink) => {
    replace(`${basePath}?category=${chip.value}`);
  };

  return (
    <Suspense fallback={<ChipsLoading />}>
      <CategoryChips active_category={categoryId} onChipClick={handleChipClick} />
    </Suspense>
  );
};
