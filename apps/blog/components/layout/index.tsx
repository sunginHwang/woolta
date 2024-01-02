import { FC, PropsWithChildren, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import NotificationBar from '../common/notification/NotificationBar';
import Loading from '../common/Loading';
import styled from '@emotion/styled';
import { useLayout } from './hooks/useLayout';
import { css } from '@emotion/react';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isEditMode } = useLayout();
  const [showSidebar, setShowSideBar] = useState(false);
  const spinnerLoading = false;

  return (
    <SC.Content>
      <Header />
      <Loading isLoading={spinnerLoading} />
      <div css={isEditMode ? EditModeCss : noneEditModeCss}>
        {/* <ThemeHeader>
          <ToggleThemeSwitch isDarkMode={isDarkMode} onChangeTheme={toggleTheme} />
        </ThemeHeader> */}
        {children}
      </div>
      <NotificationBar />
      <Footer />
    </SC.Content>
  );
};

export default Layout;

const SC = {
  Content: styled.main`
    background-color: ${({ theme }) => theme.colors.white};
  `,
};

const noneEditModeCss = css`
  min-height: 100%;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 80rem;
`;
const EditModeCss = css`
  height: 100%;
  width: 100%;
  padding: 0;
`;
