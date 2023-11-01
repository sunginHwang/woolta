import React from 'react';
import { MdList } from 'react-icons/md';
import { customGray, green200 } from '../../../style/colors';
import layouts from '../../../style/layouts';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { goMainPage } from 'apps/blog/utils/routeUtil';
import useToast from 'apps/blog/hooks/useToast';

type HeaderProps = {
  showMobileHeader: boolean;
  showSideBar: boolean;
  toggleSideBar: (toggle: boolean) => void;
};

function Header({ showMobileHeader, showSideBar, toggleSideBar }: HeaderProps) {
  const { hideToast } = useToast();

  const onMainPageClick = React.useCallback(() => {
    goMainPage();
    toggleSideBar(false);
    hideToast();
  }, []);

  const onToggleSideBar = React.useCallback(() => toggleSideBar(!showSideBar), [showSideBar]);

  return (
    <>
      <SC.Header isShowMobileHeader={showMobileHeader}>
        <SC.HeaderLogo onClick={onMainPageClick}>woolta</SC.HeaderLogo>
        <SC.HeaderMenu onClick={onToggleSideBar}>
          <MdList />
        </SC.HeaderMenu>
      </SC.Header>
    </>
  );
}

Header.defaultProps = {
  showMobileHeader: false,
  showSideBar: false,
} as HeaderProps;

export default Header;

const SC = {
  Header: styled.div<{ isShowMobileHeader: boolean }>`
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;
    background-color: ${customGray};
    color: ${green200};
    border-bottom-style: solid;
    height: ${layouts.mainHeaderHeight};
    border-color: ${customGray};
    border-width: 0.1rem 0.1rem 0.2rem 0.1rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      transition: all 0.2s ease-in-out;
      ${(props) =>
        props.isShowMobileHeader &&
        css`
          top: -${layouts.mainHeaderHeight};
          border: none;
        `}
    }
  `,

  HeaderLogo: styled.span`
    font-weight: bolder;
    font-size: 2rem;
    padding: 1.6rem;
    cursor: pointer;
  `,
  HeaderMenu: styled.span`
    cursor: pointer;
    font-size: 3rem;
    margin: 1.6rem;
  `,
};
