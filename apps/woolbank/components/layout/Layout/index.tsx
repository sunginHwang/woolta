'use client';

import { FC, PropsWithChildren } from 'react';
//import Header from '../Header';
import NavigationBar from '../NavigationBar';

interface Props extends PropsWithChildren {
  useNavBar?: boolean;
}

/**
 * 레이아웃 영역
 * @component
 */
const Layout: FC<Props> = ({ children, useNavBar = true }) => {
  return (
    <main>
      {/* 헤더가 inii ssr 시점에 문제가 존재. */}
      {/* <Header title='뱅킷리스트' description='계좌 정보를 한곳에 모으고 도전하고 싶은 버킷리스트를 만들어봐요~' /> */}
      {children}
      {useNavBar && <NavigationBar />}
    </main>
  );
};

export default Layout;
