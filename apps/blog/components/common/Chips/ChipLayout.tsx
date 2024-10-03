import { invisibleScrollBar, white } from '@wds';
import { forwardRef, PropsWithChildren } from 'react';
import { styled } from 'styled-components';

interface Props extends PropsWithChildren {
  /**
   * stickey 처리가 필요한 경우 stickey 할 만큼의  height를 정의합니다.
   */
  stickey_height?: number;
  /**
   * padding 여백을 설정 합니다.
   * @default 0.8rem 1rem;
   */
  padding?: string;
}

export const ChipLayout = forwardRef<HTMLUListElement, Props>(
  ({ padding = '.8rem 1rem', stickey_height, children, ...rest }, parents_ref) => {
    return (
      <SC.Container
        ref={parents_ref}
        $use_stickey={!stickey_height}
        $stickey_height={stickey_height}
        $padding={padding}
        {...rest}
      >
        {children}
      </SC.Container>
    );
  },
);

const SC = {
  Container: styled.ul<{ $use_stickey?: boolean; $stickey_height?: number; $padding?: string }>`
    ${invisibleScrollBar}
    padding: ${({ $padding = '0.8rem 1.6rem;' }) => $padding};
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    position: relative;
    gap: 6px;
    display: flex;
    align-items: center;
    scrollbar-width: none;
    ${({ $use_stickey, $stickey_height }) =>
      $use_stickey &&
      `
        position: sticky;
        z-index: 1;
        top: ${$stickey_height}px;
    `}
    background-color: ${white};

    a:active {
      background-color: ${white};
    }
  `,
};
