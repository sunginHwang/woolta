'use client';

import styled from 'styled-components';
import { AccountBookActiveTab } from './account-book-active-tab/AccountBookActiveTab';
import { AccountBookTabs } from './account-book-tabs/AccountBookTabs';
import AccountCardInfo from './account-list/account-card-info/AccountCardInfo';
import MonthStatistics from './account-list/MonthStatistics';
import { Footer } from './footer/Footer';

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  return (
    <>
      {/* <AccountCardInfo /> */}
      <MonthStatistics />
      <SC.Line />
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
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Line: styled.div`
    /* background-color: ${({ theme }) => theme.colors.gray100}; */
    min-height: 3rem;
  `,
};
