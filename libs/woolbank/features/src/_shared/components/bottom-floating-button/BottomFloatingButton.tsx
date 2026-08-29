'use client';

import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { Button } from '../button/Button';

interface Props extends Pick<ComponentProps<typeof Button>, 'onClick' | 'disabled' | 'children' | 'loading'> {
  isShow?: boolean;
}

/**
 * 하단 고정 버튼
 * @component
 */
export const BottomFloatingButton = ({
  children,
  loading = false,
  disabled = false,
  isShow = false,
  onClick,
}: Props) => {
  if (!isShow) {
    return null;
  }

  return (
    <div {...stylex.props(styles.bottom)}>
      <Button fill name='bottomButton' disabled={disabled} loading={loading} onClick={onClick}>
        {children}
      </Button>
    </div>
  );
};

const styles = stylex.create({
  bottom: {
    position: 'absolute',
    bottom: '2rem',
    left: '2rem',
    width: 'calc(100% - 4rem)',
    height: '5.5rem',
    zIndex: 100,
  },
});
