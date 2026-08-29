'use client';

import { useMount } from '@common';
import { MouseEvent, useMemo, useRef } from 'react';
import { useStickeyScrollReset } from '../hooks/useStickeyScrollReset';
import { ChipLayout } from './ChipLayout';
import { ChipsLoading } from './ChipsLoading';
import Item, { ChipItemWithLink } from './Item';

type ChipElement = HTMLElement | null;

interface Props {
  is_loading?: boolean;
  chips?: ChipItemWithLink[];
  active_chip_value?: string;
  is_replace?: boolean;
  stickey_height?: number;
  padding?: string;
  aria_label?: string;
  onChipClick?: (chip: ChipItemWithLink, e: MouseEvent<HTMLElement>, index: number) => void;
}

export const Chips = ({
  chips = [],
  active_chip_value = '',
  aria_label = '',
  padding = '.8rem 1rem',
  is_replace,
  is_loading,
  stickey_height,
  onChipClick,
}: Props) => {
  const chip_list_ref = useRef<HTMLUListElement>(null);
  const chip_item_ref = useRef<ChipElement[]>([]);
  const use_stickey = stickey_height !== undefined;
  const { scroll_target_ref, resetScrollTo } = useStickeyScrollReset();

  const selected_index = useMemo(() => {
    return chips.findIndex((chip) => chip.value === active_chip_value) ?? 0;
  }, [chips, active_chip_value]);

  useMount(() => {
    if (chip_list_ref.current && !!chip_item_ref.current[selected_index]) {
      const offset_left = Number(chip_item_ref.current[selected_index]?.offsetLeft);
      const offset_width = Number(chip_item_ref.current[selected_index]?.offsetWidth);
      chip_list_ref.current.scrollTo({ left: offset_left - offset_width });
    }
  });

  const handleChipClick = (e: MouseEvent<HTMLElement>, chip: ChipItemWithLink, idx: number) => {
    if (e.currentTarget !== null) {
      const { offsetLeft: offset_left, offsetWidth: offset_width } = e.currentTarget;
      chip_list_ref.current?.scrollTo({
        left: offset_left - offset_width,
        behavior: 'smooth',
      });
    }

    if (use_stickey) {
      resetScrollTo(stickey_height);
    }

    onChipClick?.(chip, e, idx);
  };

  if (is_loading) {
    return <ChipsLoading stickey_height={stickey_height} padding={padding} />;
  }

  return (
    <>
      {use_stickey && <div ref={scroll_target_ref} />}
      <ChipLayout stickey_height={stickey_height} ref={chip_list_ref} aria-label={aria_label} padding={padding}>
        {chips.map((chip, index) => (
          <Item
            ref={(element) => {
              chip_item_ref.current[index] = element;
            }}
            key={chip.value}
            chip={chip}
            onClick={handleChipClick}
            active_chip_value={active_chip_value}
            index={index}
            is_replace={is_replace}
          />
        ))}
      </ChipLayout>
    </>
  );
};
