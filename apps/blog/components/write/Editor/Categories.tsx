import { useAtom } from 'jotai';
import { ChipItemWithLink } from '../../common/Chips/Item';
import CategoryChips from '../../home/common/CategoryChips';
import { postCategoryAtom } from '../store';
import { useCategories } from '../../home/hooks/useCategories';
import { useEffect } from 'react';

const Categories = () => {
  const [postCategory, setPostCategory] = useAtom(postCategoryAtom);
  const { categoriesExceptAll } = useCategories();

  useEffect(() => {
    const isInjectInitCategory = postCategory === '' && categoriesExceptAll.length > 0;

    if (isInjectInitCategory) {
      const firstCategory = categoriesExceptAll[0];
      setPostCategory(String(firstCategory.value));
    }
  }, [postCategory, categoriesExceptAll]);

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

export default Categories;
