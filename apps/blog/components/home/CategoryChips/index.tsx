import { ICategory } from 'apps/blog/types/post/ICategory';
import { useCategories } from '../hooks/useCategories';
import Chips from '../../base/Chips';
import { ChipItemWithLink } from '../../base/Chips/Item';

const CategoryChips = () => {
  const { categories, isLoading } = useCategories();

  const cateogryChips = categories.map<ChipItemWithLink>((category) => ({
    name: category.label,
    value: category.value,
    href: '',
  }));

  return <Chips chips={cateogryChips} is_loading={isLoading} />;
};

export default CategoryChips;
