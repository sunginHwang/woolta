'use client';

import { ComponentProps } from 'react';
import styled from 'styled-components';
import { Button } from '../button/Button';

interface Props extends Pick<ComponentProps<typeof Button>, 'onClick' | 'disabled' | 'children' | 'loading'> {
  isShow?: boolean;
}

/**
 * 하단 고정 버튼
 * @component
 */
export const BottomFloatingButton = ({ children, loading = false, disabled = false, isShow = false, onClick }: Props) => {
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
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    width: calc(100% - 4rem);
    height: 5.5rem;
    z-index: 100;
  `,
};