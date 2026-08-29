import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { forwardRef, type PropsWithChildren } from 'react';

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

const styles = stylex.create({
  container: {
    whiteSpace: 'nowrap',
    overflowX: 'scroll',
    overflowY: 'hidden',
    position: 'relative',
    gap: '6px',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colorVars['--color-white'],
    // invisibleScrollBar mixin
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '::-webkit-scrollbar': { display: 'none' },
  },
  stickey: {
    position: 'sticky',
    zIndex: 1,
  },
});

const dynamicStyles = stylex.create({
  padding: (padding: string) => ({ padding }),
  top: (top: number | undefined) => ({ top: top === undefined ? null : `${top}px` }),
});

export const ChipLayout = forwardRef<HTMLUListElement, Props>(
  ({ padding = '.8rem 1rem', stickey_height, children, ...rest }, parents_ref) => {
    // 원본과 동일: stickey_height 가 없을 때 sticky 를 건다
    const use_stickey = !stickey_height;

    return (
      <ul
        ref={parents_ref}
        {...rest}
        {...stylex.props(
          styles.container,
          dynamicStyles.padding(padding),
          use_stickey && styles.stickey,
          use_stickey && dynamicStyles.top(stickey_height),
        )}
      >
        {children}
      </ul>
    );
  },
);
