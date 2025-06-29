'use client';

import styled from 'styled-components';
import { AccountBookActiveTab } from './account-book-active-tab/AccountBookActiveTab';
import { AccountBookTabs } from './AccountBookTabs';
import MonthStatistics from './AccountList/MonthStatistics';
import { Footer } from './footer/Footer';

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  return (
    <>
      <MonthStatistics />
      <SC.Main>
        <AccountBookActiveTab />
      </SC.Main>
      <AccountBookTabs />
      <Footer />
    </>
  );
};

export default AccountBookListPage;

const SC = {
  Main: styled.main`
    background-color: white;
  `,
};
