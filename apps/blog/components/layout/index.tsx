import { useEffect, useState } from 'react';
import SideBar from './SideBar';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const [showSidebar, setShowSideBar] = useState(false);

  return (
    <>
      <SideBar
        isOpen={showSidebar}
        userInfo={userInfo}
        categories={categories}
        onLogout={onLogout}
        toggleSideBar={setShowSideBar}
      />
      <Header showSideBar={showSidebar} showMobileHeader={mobileHeader} toggleSideBar={setShowSideBar} />
      <SpinnerLoading loading={spinnerLoading} />
      <NanoBarLoading />
      <Content editMode={editMode}>
        <ThemeHeader>
          <ToggleThemeSwitch isDarkMode={isDarkMode} onChangeTheme={toggleTheme} />
        </ThemeHeader>
        {children}
      </Content>
      <NotificationBar isShow={toast.isShow} message={toast.message} />
      <Footer />
    </>
  );
};

export default Layout;
