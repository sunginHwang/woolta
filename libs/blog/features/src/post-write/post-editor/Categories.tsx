'use client';

import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { CategoryChips } from '../../_shared/category-chips/CategoryChips';
import type { ChipItemWithLink } from '../../_shared/chips/Item';
import { useCategories } from '../../_shared/hooks/useCategories';
import { postCategoryAtom } from '../../_shared/write-store';

export const Categories = () => {
  const [postCategory, setPostCategory] = useAtom(postCategoryAtom);
  const { categoriesExceptAll } = useCategories();

  useEffect(() => {
    const isInjectInitCategory = postCategory === '' && categoriesExceptAll.length > 0;

    if (isInjectInitCategory) {
      const firstCategory = categoriesExceptAll[0];
      setPostCategory(String(firstCategory.value));
    }
  }, [postCategory, categoriesExceptAll, setPostCategory]);

  const handleChipClick = (chip: ChipItemWithLink) => {
    setPostCategory(chip.value);
  };

  return (
    <CategoryChips
      useAllCategory={false}
      useLink={false}
      active_category={postCategory}
      onChipClick={handleChipClick}
    />
  );
};
