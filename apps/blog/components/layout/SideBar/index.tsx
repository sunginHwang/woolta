import styled from '@emotion/styled';
import { useUserInfo } from 'apps/blog/hooks/queries/useUserInfo';
import { goLoginPage, goPostEditPage, goPostListPage } from 'apps/blog/utils/routeUtil';
import { useCallback } from 'react';
import layouts from '../../../style/layouts';
import { useCategories } from '../hooks/useCategories';
import useToast from 'apps/blog/hooks/useToast';

type SideBarProps = {
  isOpen: boolean;
  toggleSideBar: (toggle: boolean) => void;
};

function SideBar({ isOpen, toggleSideBar }: SideBarProps) {
  const { hideToast } = useToast();
  const { userInfo, logout } = useUserInfo();
  const { categories } = useCategories();
  const clearSideMenu = useCallback(() => {
    toggleSideBar(false);
    hideToast();
  }, []);

  const onLoginClick = useCallback(() => {
    goLoginPage();
    clearSideMenu();
  }, []);

  const onPostEditClick = useCallback(() => {
    goPostEditPage();
    clearSideMenu();
  }, []);

  const isLogin: boolean = userInfo.userId !== '';

  const renderCategories = categories.map((category) => {
    // 카테고리 페이지 이동
    const goCategoryPage = () => {
      goPostListPage(category.value);
      clearSideMenu();
    };

    return (
      <li key={category.value}>
        <a onClick={goCategoryPage}>{category.label}</a>
      </li>
    );
  });

  const renderUserMenu = (
    <li>
      <a>
        <SC.UserImage src={userInfo.imageUrl} />
        <span>{userInfo.userId}</span>
        <SC.Loout onClick={logout}>로그아웃</SC.Loout>
      </a>
    </li>
  );

  const renderNonUserMenu = (
    <li>
      <a onClick={onLoginClick}>로그인</a>
    </li>
  );

  const renderPostWriteMenu = isLogin === true && (
    <li>
      <a onClick={onPostEditClick}>글쓰기 페이지 이동</a>
    </li>
  );

  return (
    <>
      <SC.Contaienr isSideBarOpen={isOpen}>
        <ul>
          {isLogin ? renderUserMenu : renderNonUserMenu}
          {renderPostWriteMenu}
          {renderCategories}
        </ul>
      </SC.Contaienr>
      {isOpen && <SC.SideBarWhiteSpace />}
    </>
  );
}

export default SideBar;

const SC = {
  Contaienr: styled.div<{ isSideBarOpen: boolean }>`
    border: 0.1rem solid ${({ theme }) => theme.colors.customGray};
    width: ${layouts.mainRightWidth};
    height: 100%;
    position: fixed;
    font-size: 1.6rem;
    z-index: ${layouts.sideBarZIndex * 2};
    background-color: ${({ theme }) => theme.colors.white};
    top: ${layouts.mainHeaderHeight};

    right: ${({ isSideBarOpen }) => (isSideBarOpen ? 0 : `-${layouts.mainRightWidth}`)};
    transition: all 0.1s ease;

    ul {
      margin-top: 3.2rem !important;

      li {
        a {
          text-align: left;
          display: block;
          text-decoration: none;
          padding: 1.6rem;
          border-left: 0.2px solid transparent;
          font-weight: 400;
          color: ${({ theme }) => theme.colors.grayPrimary};
          cursor: pointer;
        }

        &:hover {
          color: ${({ theme }) => theme.colors.grayMain};
          background-color: ${({ theme }) => theme.colors.customGray};
        }
      }
    }
  `,
  Loout: styled.p`
    cursor: pointer;
    float: right;
  `,
  UserImage: styled.img`
    float: left;
    width: 2.5rem;
    margin-right: 1rem;
    border-radius: 50%;
    height: 100%;
    vertical-align: middle;
  `,
  SideBarWhiteSpace: styled.div`
    background-color: ${({ theme }) => theme.colors.gray800};
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: ${layouts.sideBarZIndex};
  `,
};
