import { useMount } from '@common';
import { white, SkeletonBar, invisibleScrollBar } from '@wds';
import { useStickeyScrollReset } from 'apps/blog/hooks/useStickeyScrollReset';
import { FC, MouseEvent, useMemo, useRef } from 'react';
import { styled, CSSProp } from 'styled-components';
import Item, { ChipItemWithLink } from './Item';

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
   * @default 0.8rem 1.6rem;
   */
  padding?: string;
  /**
   * custom 스타일 css 를 정의합니다.
   */
  custom_css?: CSSProp;
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
const Chips = ({
  chips = [],
  active_chip_value = '',
  aria_label = '',
  padding,
  is_replace,
  is_loading,
  custom_css,
  stickey_height,
  onChipClick,
}: Props) => {
  const chip_list_ref = useRef<HTMLUListElement>(null);
  const chip_item_ref = useRef<any[]>([]);
  const use_stickey = stickey_height !== undefined;
  const { scroll_target_ref, resetScrollTo } = useStickeyScrollReset();

  const selected_id = useMemo(() => {
    return
  }, [chips, active_chip_value]);

  useMount(() => {
    if (chip_list_ref.current && !!chip_item_ref.current[selected_id]) {
      const offset_left = Number(chip_item_ref.current[selected_id]?.offsetLeft);
      const offset_width = Number(chip_item_ref.current[selected_id]?.offsetWidth);

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
    return <Loading stickey_height={stickey_height} padding={padding} />;
  }

  return (
    <>
      {use_stickey && <div ref={scroll_target_ref} />}
      <SC.Container
        use_stickey={use_stickey}
        stickey_height={stickey_height}
        ref={chip_list_ref}
        css={custom_css}
        aria-label={aria_label}
        padding={padding}
      >
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
      </SC.Container>
    </>
  );
};

const Loading: FC<Pick<Props, 'padding' | 'stickey_height'>> = ({ padding, stickey_height }) => {
  return (
    <SC.Container use_stickey={!stickey_height} stickey_height={stickey_height} padding={padding}>
      {[47, 58, 46, 85, 47, 58].map((width, index) => (
        <li key={index}>
          <SkeletonBar width={`${width / 10}rem`} height='3.6rem' radius={18} />
        </li>
      ))}
    </SC.Container>
  );
};

export default Object.assign(Chips, {
  Loading,
});

const SC = {
  Container: styled.ul<{ use_stickey?: boolean; stickey_height?: number; padding?: string }>`
    ${invisibleScrollBar}
    padding: ${({ padding = '0.8rem 1.6rem;' }) => padding};
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    position: relative;
    gap: 6px;
    display: flex;
    align-items: center;
    scrollbar-width: none;
    ${({ use_stickey, stickey_height }) =>
      use_stickey &&
      `
        position: sticky;
        z-index: 1;
        top: ${stickey_height}px;
    `}
    background-color: ${white};

    a:active {
      background-color: ${white};
    }
  `,
};
