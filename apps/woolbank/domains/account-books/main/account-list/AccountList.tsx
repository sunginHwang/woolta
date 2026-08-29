'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import AccountBookList from './account-book-list/AccountBookList';
import MonthStatistics from './MonthStatistics';

const styles = stylex.create({
  line: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginTop: '2rem',
    marginInline: 0,
    marginBottom: '3rem',
  },
});

/**
 * 가계부 리스트
 * @component
 */
const AccountList = () => {
  return (
    <>
      <MonthStatistics />
      <div {...stylex.props(styles.line)} />
      <AccountBookList />
    </>
  );
};

export default AccountList;
