import { FC, MouseEvent } from 'react';
import { Chips } from '../../../common/chips/Chips';
import { ChipItemWithLink } from '../../../common/chips/Item';
import { useCategories } from '../../hooks/useCategories';

interface Props {
  active_category: string;
  useLink?: boolean;
  useAllCategory?: boolean;
  onChipClick?: (chip: ChipItemWithLink, e: MouseEvent<HTMLElement>, idx: number) => void;
}

export const CategoryChips: FC<Props> = ({ active_category, useLink, useAllCategory = true, onChipClick }) => {
  const { categories, categoriesExceptAll } = useCategories();
  const categoriesFilterByAll = useAllCategory ? categories : categoriesExceptAll;
  const cateogryChips = categoriesFilterByAll.map<ChipItemWithLink>((category) => ({
    name: category.label,
    value: String(category.value),
    href: useLink ? '' : undefined,
  }));

  return <Chips chips={cateogryChips} active_chip_value={active_category} onChipClick={onChipClick} />;
};
