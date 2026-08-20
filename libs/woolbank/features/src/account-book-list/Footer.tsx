'use client';

import { styled } from 'styled-components';

/**
 * 가계부 리스트 하단 여백
 * @component
 */
export const Footer = () => {
  return <SC.Footer />;
};

const SC = {
  Footer: styled.footer`
    width: 100%;
    height: 18rem;
    background-color: ${({ theme }) => theme.colors.white};
  `,
};
