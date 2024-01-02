import { useScrollDirection } from '@common';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import layouts from '../../../style/layouts';

const Header = () => {
  const scroll_direction = useScrollDirection();
  const isHideHeader = scroll_direction === 'down';

  return (
    <>
      <SC.Header isHideHeader={isHideHeader}>
        <Link href='/'>
          <SC.HeaderLogo>woolta</SC.HeaderLogo>
        </Link>
      </SC.Header>
    </>
  );
};

export default Header;

const SC = {
  Header: styled.div<{ isHideHeader: boolean }>`
    position: sticky;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: ${layouts.HeaderHeight};
    height: ${layouts.HeaderHeight};
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.customGray};
    border-bottom: 1px solid ${({ theme }) => theme.colors.bgSecondary};
    padding: 0 1.6rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      transition: all 0.2s ease-in-out;
      height: ${layouts.mobileHeader};

      ${({ isHideHeader }) =>
        isHideHeader &&
        css`
          top: -${layouts.mainHeaderHeight};
          border: none;
        `}
    }
  `,

  HeaderLogo: styled.p`
    font-weight: bolder;
    font-size: 2rem;
    cursor: pointer;
  `,
  HeaderMenu: styled.span`
    cursor: pointer;
    font-size: 3rem;
  `,
};
