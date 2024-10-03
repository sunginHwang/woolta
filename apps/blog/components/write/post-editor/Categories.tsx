import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { ChipItemWithLink } from '../../common/chips/Item';
import { CategoryChips } from '../../home/common/category-chips/CategoryChips';
import { useCategories } from '../../home/hooks/useCategories';
import { postCategoryAtom } from '../store';

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
