'use client';

import { safeAreaInsetBottom, typography } from '@wds';
import Link from 'next/link';
import { ComponentProps, FC } from 'react';
import { styled } from 'styled-components';
import { layout } from '../../style/layout';

type Props = ComponentProps<typeof Link>;

/**
 * 추가버튼 -  우측 하단 고정
 * @component
 */
export const AddButton = ({ ...rest }: Props) => {
  return (
    <aside>
      <SC.Container {...rest} data-cy='addButton'>
        +
      </SC.Container>
    </aside>
  );
};

const SC = {
  Container: styled(Link)`
    ${typography.title1Bold}
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    ${safeAreaInsetBottom('8rem')}
    right: 2rem;
    width: 5rem;
    height: 5rem;
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.red500};
    border-radius: 100% !important;
    box-shadow: 0.2rem 0.2rem 0.5rem 0.2rem rgba(0, 0, 0, 0.16);
    z-index: ${layout.zIndex.floatButton};
  `,
};
