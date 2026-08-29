'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import {
  AccountBookActiveTab,
  AccountBookAddButton,
  AccountBookTabs,
  MonthStatistics,
} from '@woolta/woolbank-features';
import { ScreenBoundary } from '../common/ScreenBoundary';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '72rem',
    minHeight: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  main: {
    flex: 1,
    backgroundColor: colorVars['--color-bgSurface'],
  },
  line: {
    minHeight: '3rem',
  },
});

/**
 * 가계부 메인 스크린 (리스트 + 캘린더 탭)
 */
export const AccountBookMainScreen = () => {
  return (
    <ScreenBoundary>
      <div {...stylex.props(styles.container)}>
        <MonthStatistics />
        <div {...stylex.props(styles.line)} />
        <main {...stylex.props(styles.main)}>
          <AccountBookActiveTab />
        </main>
        <AccountBookTabs />
        <AccountBookAddButton />
      </div>
    </ScreenBoundary>
  );
};
