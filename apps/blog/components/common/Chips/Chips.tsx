'use client';

import { useMount } from '@common';
import { MouseEvent, useMemo, useRef } from 'react';
import { useStickeyScrollReset } from '../../../hooks/useStickeyScrollReset';
import { ChipLayout } from './ChipLayout';
import { ChipsLoading } from './ChipsLoading';
import Item, { ChipItemWithLink } from './Item';

type ChipElement = HTMLElement | null;
interface Props {
  /**
   * 로딩 chip 이 필요한 경우 입니다.
   */
  is_loading?: boolean;
  /**
   * chip 리스트를 정의합니다.
   */
  chips?: ChipItemWithLink[];
  /**
   * 현재 활성화된 chip value 를 지정합니다.
   */
  active_chip_value?: string;
  /**
   * chip 링크가 replace 로 전환이 필요한 경우 사용합니다.
   */
  is_replace?: boolean;
  /**
   * stickey 처리가 필요한 경우 stickey 할 만큼의  height를 정의합니다.
   */
  stickey_height?: number;
  /**
   * padding 여백을 설정 합니다.
   * @default 0.8rem 1rem;
   */
  padding?: string;
  /**
   * aria-label 을 정의 합니다..
   */
  aria_label?: string;
  /**
   * chip클릭시 이벤트 입니다.
   */
  onChipClick?: (chip: ChipItemWithLink, e: MouseEvent<HTMLElement>, index: number) => void;
}

/**
 * chip 리스트
 * @component
 */
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
            ref={(element) => (chip_item_ref.current[index] = element)}
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
