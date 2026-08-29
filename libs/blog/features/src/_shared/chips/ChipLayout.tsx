'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { forwardRef, HTMLAttributes, PropsWithChildren } from 'react';

interface Props extends HTMLAttributes<HTMLUListElement>, PropsWithChildren {
  stickey_height?: number;
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
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '::-webkit-scrollbar': { display: 'none' },
    backgroundColor: colorVars['--color-white'],
  },
  sticky: {
    position: 'sticky',
    zIndex: 1,
  },
});

const dynamicStyles = stylex.create({
  padding: (paddingBlock: string, paddingInline: string) => ({ paddingBlock, paddingInline }),
  top: (v: number) => ({ top: `${v}px` }),
});

export const ChipLayout = forwardRef<HTMLUListElement, Props>(
  ({ padding = '.8rem 1rem', stickey_height, children, ...rest }, parents_ref) => {
    const parts = padding.split(' ').map((s) => s.replace(';', ''));
    const pBlock = parts[0];
    const pInline = parts[1] ?? pBlock;
    const isSticky = stickey_height !== undefined;

    const sx = stylex.props(
      styles.container,
      dynamicStyles.padding(pBlock, pInline),
      isSticky && styles.sticky,
      isSticky && dynamicStyles.top(stickey_height),
    );

    return (
      <ul ref={parents_ref} {...rest} {...sx}>
        {children}
      </ul>
    );
  },
);
