import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import Loading from '../common/Loading';
import NotificationBar from '../common/notification/NotificationBar';
import Footer from './Footer';
import Header from './Header';
import { useLayout } from './hooks/useLayout';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isEditMode } = useLayout();
  const spinnerLoading = false;

  return (
    <SC.Content>
      <Header />
      <Loading isLoading={spinnerLoading} />
      <div className={isEditMode ? 'EditModeCss' : 'noneEditModeCss'}>
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

    .noneEditModeCss {
      min-height: 100%;
      text-align: center;
      margin-left: auto;
      margin-right: auto;
      max-width: 80rem;
    }

    .EditModeCss {
      height: 100%;
      width: 100%;
      padding: 0;
    }
  `,
};
