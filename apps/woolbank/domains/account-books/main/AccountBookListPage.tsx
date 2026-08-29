'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { AccountBookActiveTab } from './account-book-active-tab/AccountBookActiveTab';
import { AccountBookTabs } from './account-book-tabs/AccountBookTabs';
import MonthStatistics from './account-list/MonthStatistics';
import { Footer } from './footer/Footer';

const styles = stylex.create({
  main: {
    backgroundColor: colorVars['--color-white'],
  },
  line: {
    minHeight: '3rem',
  },
});

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  return (
    <>
      {/* <AccountCardInfo /> */}
      <MonthStatistics />
      <div {...stylex.props(styles.line)} />
      <main {...stylex.props(styles.main)}>
        <AccountBookActiveTab />
      </main>
      <AccountBookTabs />
      <Footer />
    </>
  );
};

export default AccountBookListPage;
