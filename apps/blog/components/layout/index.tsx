import { FC, PropsWithChildren, useState } from 'react';
import SideBar from './SideBar';
import Footer from './Footer';
import Header from './Header';
import SpinnerLoading from '../base/loading/SpinnerLoading';
import NotificationBar from '../common/notification/NotificationBar';
import Content from './Content/inedx';
import { useRouter } from 'next/navigation';

type Props = PropsWithChildren & {};

const Layout: FC<Props> = ({ children }) => {
  const [showSidebar, setShowSideBar] = useState(false);
  const editMode = false;
  const spinnerLoading = false;
  const mobileHeader = false;
  const isEditMode = getIsWritePage();
  console.log(isEditMode);
  return (
    <>
      <SideBar isOpen={showSidebar} toggleSideBar={setShowSideBar} />
      <Header showSideBar={showSidebar} showMobileHeader={mobileHeader} toggleSideBar={setShowSideBar} />
      <SpinnerLoading loading={spinnerLoading} />
      {/* <NanoBarLoading /> */}
      <Content editMode={isEditMode}>
        {/* <ThemeHeader>
          <ToggleThemeSwitch isDarkMode={isDarkMode} onChangeTheme={toggleTheme} />
        </ThemeHeader> */}
        {children}
      </Content>
      <NotificationBar />
      <Footer editMode={isEditMode} />
    </>
  );
};

export default Layout;

function getIsWritePage() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname === '/write';
}
