'use client';

import { useIsMounted } from '@common';
import { useAtomValue } from 'jotai';
import { usePathname } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { LoadingAtom } from '../../store/layout';
import FullScreenLoading from '../../components/FullScreenLoading';
import { Alert } from './alert/Alert';
import { NavigationBar } from './navigation-bar/NavigationBar';
import { Toast } from './toast/Toast';

const NAVIGATION_PATH_LIST = [
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
export const Layout = ({ children }: Props) => {
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const { isLoading, message } = useAtomValue(LoadingAtom);

  const useNavBar = NAVIGATION_PATH_LIST.find((path) => pathname === path);
  return (
    <SC.Container>
      {children}
      {useNavBar && <NavigationBar />}
      {isMounted && (
        <>
          <FullScreenLoading loading={isLoading} message={message} />
          <Alert />
          <Toast />
        </>
      )}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    width: 100%;
    min-width: 320px;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding-bottom: 0;
    padding-bottom: calc(env(safe-area-inset-bottom) + 0px);
    padding-bottom: calc(constant(safe-area-inset-bottom) + 0px);
    background-color: white;
  `,
};
