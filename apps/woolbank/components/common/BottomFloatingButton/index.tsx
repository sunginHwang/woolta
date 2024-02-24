import React, { ComponentProps, FC, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { Button } from '../../atom/Button';

interface Props extends Pick<ComponentProps<typeof Button>, 'onClick' | 'disabled' | 'children' | 'loading'> {
  // 버튼 디스플레이 여부
  isShow?: boolean;
}

/**
 * 하단 고정 버튼
 * @component
 */

export const BottomFloatingButton: FC<Props> = ({
  children,
  loading = false,
  disabled = false,
  isShow = false,
  onClick,
}) => {
  if (!isShow) {
    return null;
  }

  return (
    <SC.Bottom>
      <Button fill name='bottomButton' disabled={disabled} loading={loading} onClick={onClick}>
        {children}
      </Button>
    </SC.Bottom>
  );
};

const SC = {
  Bottom: styled.div`
    position: fixed;
    bottom: 2rem;
    bottom: calc(constant(safe-area-inset-bottom) + 2rem);
    bottom: calc(env(safe-area-inset-bottom) + 2rem);
    left: 2rem;
    width: calc(100% - 4rem);
    height: 5.5rem;
  `,
};
