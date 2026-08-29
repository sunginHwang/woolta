import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import Link from 'next/link';
import { forwardRef, type MouseEvent } from 'react';
import Chip, { type ChipItem } from './Chip';

// ChipLayout 의 `a:active` 자손 선택자를 옮겨온 것 — StyleX 는 자손 선택자를 지원하지 않는다
const styles = stylex.create({
  link: {
    backgroundColor: { default: null, ':active': colorVars['--color-white'] },
  },
});

export interface ChipItemWithLink extends ChipItem {
  href?: string;
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

    const link_props = is_replace ? { href: chip?.href ?? '', replace: true } : { href: chip?.href ?? '' };
    const class_name = chip.value === active_chip_value ? 'active' : '';

    return (
      <li ref={parents_ref} onClick={handleChipClick}>
        {chip.href ? (
          <Link {...link_props} {...stylex.props(styles.link)}>
            <Chip text={chip.name} active={chip.value === active_chip_value} className={class_name} />
          </Link>
        ) : (
          <Chip text={chip.name} active={chip.value === active_chip_value} className={class_name} />
        )}
      </li>
    );
  },
);

export default Item;
