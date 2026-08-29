'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
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
});

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <div {...stylex.props(styles.container)}>
      <AppRail />
      <main {...stylex.props(styles.content)}>{children}</main>
    </div>
  );
};

export default AppShell;
