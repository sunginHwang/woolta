import { FC, MouseEvent } from 'react';
import Chips from '../../base/Chips';
import { ChipItemWithLink } from '../../base/Chips/Item';
import { useCategories } from '../../home/hooks/useCategories';

interface Props {
  active_category: string;
  useLink?: boolean;
  useAllCategory?: boolean;
  onChipClick?: (chip: ChipItemWithLink, e: MouseEvent<HTMLElement>, idx: number) => void;
}

const CategoryChips: FC<Props> = ({ active_category, useLink, useAllCategory = true, onChipClick }) => {
  const { categories, categoriesExceptAll, isLoading } = useCategories();

  const categoriesFilterByAll = useAllCategory ? categories : categoriesExceptAll;

  const cateogryChips = categoriesFilterByAll.map<ChipItemWithLink>((category) => ({
    name: category.label,
    value: category.value,
    href: useLink ? '' : undefined,
  }));

  return (
    <Chips chips={cateogryChips} is_loading={isLoading} active_chip_value={active_category} onChipClick={onChipClick} />
  );
};

export default CategoryChips;
