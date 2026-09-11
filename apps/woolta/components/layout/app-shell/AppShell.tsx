'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import AppRail from './AppRail';

const styles = stylex.create({
  container: {
    display: 'flex',
    height: '100dvh',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    backgroundColor: colorVars['--color-bgPage'],
  },
  /** 레일 없이 전체를 쓰는 화면(로그인 등) */
  bare: {
    height: '100dvh',
    overflowY: 'auto',
    backgroundColor: colorVars['--color-bgPage'],
  },
});

/** 좌측 레일을 띄우지 않는 경로. 로그인 전에는 앱 목록이 의미가 없다. */
const RAIL_LESS_PATHS = ['/login'];

const AppShell = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // Providers(QueryClient · 테마 · Confirm)는 그대로 유지해야 한다 — 로그인 뮤테이션이 쓴다.
  if (RAIL_LESS_PATHS.includes(pathname)) {
    return <main {...stylex.props(styles.bare)}>{children}</main>;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <AppRail />
      <main {...stylex.props(styles.content)}>{children}</main>
    </div>
  );
};

export default AppShell;
