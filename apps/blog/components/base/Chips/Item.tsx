import Link from 'next/link';
import { MouseEvent, forwardRef, useEffect, useMemo } from 'react';
import Chip, { ChipItem } from './Chip';

export interface ChipItemWithLink extends ChipItem {
  href: string;
}

interface Props {
  chip: ChipItemWithLink;
  active_chip_value: string;
  onClick?: (e: MouseEvent<HTMLElement>, chip: ChipItemWithLink, idx: number) => void;
  index: number;
  is_replace?: boolean;
}

/**
 * 칩리스트 - 아이탬
 * @component
 */
const Item = forwardRef<HTMLLIElement, Props>(
  ({ chip, active_chip_value, onClick, index, is_replace }, parents_ref) => {
    const handleChipClick = (e: MouseEvent<HTMLElement>) => {
      onClick?.(e, chip, index);
    };

    const link_props = is_replace ? { href: chip.href, replace: true } : { href: chip.href };

    const class_name = chip.value === active_chip_value ? 'active' : '';

    return (
      <li ref={parents_ref}>
        <Link {...link_props} onClick={handleChipClick}>
          <Chip text={chip.name} active={chip.value === active_chip_value} className={class_name} />
        </Link>
      </li>
    );
  },
);

export default Item;
