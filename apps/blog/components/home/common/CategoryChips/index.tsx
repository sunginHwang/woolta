import { FC, MouseEvent, Suspense } from 'react';
import Chips from '../../../common/Chips';
import { ChipItemWithLink } from '../../../common/Chips/Item';
import { useCategories } from '../../hooks/useCategories';

const CHIP_PADDING = '.8rem 0';

interface Props {
  active_category: string;
  useLink?: boolean;
  useAllCategory?: boolean;
  onChipClick?: (chip: ChipItemWithLink, e: MouseEvent<HTMLElement>, idx: number) => void;
}

const CategoryChips: FC<Props> = (props) => {
  return (
    <Suspense fallback={<Chips.Loading padding={CHIP_PADDING} />}>
      <Core {...props} />
    </Suspense>
  );
};

const Core: FC<Props> = ({ active_category, useLink, useAllCategory = true, onChipClick }) => {
  const { categories, categoriesExceptAll } = useCategories();
  const categoriesFilterByAll = useAllCategory ? categories : categoriesExceptAll;
  const cateogryChips = categoriesFilterByAll.map<ChipItemWithLink>((category) => ({
    name: category.label,
    value: String(category.value),
    href: useLink ? '' : undefined,
  }));

  return (
    <Chips padding={CHIP_PADDING} chips={cateogryChips} active_chip_value={active_category} onChipClick={onChipClick} />
  );
};

export default CategoryChips;
