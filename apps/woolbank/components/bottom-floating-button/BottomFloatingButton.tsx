import * as stylex from '@stylexjs/stylex';
import type { ComponentProps } from 'react';
import { Button } from '../atom/Button';

interface Props extends Pick<ComponentProps<typeof Button>, 'onClick' | 'disabled' | 'children' | 'loading'> {
  // 버튼 디스플레이 여부
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
    position: 'fixed',
    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 2rem)',
    left: '2rem',
    width: 'calc(100% - 4rem)',
    height: '5.5rem',
    zIndex: 100,
  },
});
