'use client';

import Header from '../../common/Header';
import AccountList from './AccountList';

/**
 * 가계부
 * @component
 */
const AccountBookList = () => {
  return (
    <>
      <Header title='가계부' />
      <AccountList />
    </>
  );
};

export default AccountBookList;
