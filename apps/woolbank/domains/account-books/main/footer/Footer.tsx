'use client';

import { styled } from 'styled-components';

/**
 * 가계부
 * @component
 */
export const Footer = () => {
  return <SC.Footer />;
};

const SC = {
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin: 2rem 0 1rem;
  `,
  Footer: styled.footer`
    width: 100%;
    height: 18rem;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Img: styled.img`
    width: 128px;
  `,
};
