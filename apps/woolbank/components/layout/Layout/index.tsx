import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
//import Header from '../Header';
import { LoadingAtom } from '../../../store/layout';
import FullScreenLoading from '../../common/FullScreenLoading';
import { Alert } from '../Alert';
import Header from '../Header';
import NavigationBar from '../NavigationBar';
import { Toast } from '../Toast';

const NAVIGATION_PATHS = [
  '/',
  '/regular-extenditure',
  '/account-book-statistic',
  '/account-books',
  '/bucket-list',
  '/my-page',
];

interface Props extends PropsWithChildren {
  useNavBar?: boolean;
}

/**
 * 레이아웃 영역
 * @component
 */
const Layout: FC<Props> = ({ children }) => {
  const pathname = usePathname();
  const { isLoading, message } = useAtomValue(LoadingAtom);

  const useNavBar = NAVIGATION_PATHS.find((path) => pathname === path);
  return (
    <main>
      <Header title='뱅킷리스트' description='계좌 정보를 한곳에 모으고 도전하고 싶은 버킷리스트를 만들어봐요~' />
      {children}
      {useNavBar && <NavigationBar />}
      <FullScreenLoading loading={isLoading} message={message} />
      <Toast />
      <Alert />
    </main>
  );
};

export default Layout;
