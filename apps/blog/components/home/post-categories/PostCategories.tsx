'use client';

import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import { ChipsLoading } from '../../common/chips/ChipsLoading';
import { ChipItemWithLink } from '../../common/chips/Item';
import { CategoryChips } from '../common/category-chips/CategoryChips';
import { useHomeRouterProps } from '../hooks/useHomeRouterProps';

export const PostCategories = () => {
  const { replace } = useRouter();
  const { categoryId } = useHomeRouterProps();

  const handleChipClick = (chip: ChipItemWithLink) => {
    replace(`/?category=${chip.value}`);
  };

  return (
    <Suspense fallback={<ChipsLoading />}>
      <CategoryChips active_category={categoryId} onChipClick={handleChipClick} />
    </Suspense>
  );
};
