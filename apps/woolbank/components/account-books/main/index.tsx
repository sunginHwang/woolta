'use client';

import { Suspense } from '@wds';
import { styled } from 'styled-components';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import AddButton from '../../common/AddButton';
import { AccountBookCalendar } from './AccountBookCalendar';
import { AccountBookTabs } from './AccountBookTabs';
import AccountBookList from './AccountList/AccountBookList';
import MonthStatistics from './AccountList/MonthStatistics';
import { useAccountBookListRouterQuery } from './hooks/useAccountBookListRouterQuery';

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  const { isShareUser } = useUserInfo();
  const { activeTab } = useAccountBookListRouterQuery();

  return (
    <>
      <MonthStatistics />
      <AccountBookTabs />
      {activeTab !== 'calendar' && <AccountBookList />}
      {activeTab === 'calendar' && (
        <Suspense fallback={<div></div>}>
          <AccountBookCalendar />
        </Suspense>
      )}
      <SC.Footer />
      {!isShareUser && <AddButton href='/account-books/save' />}
    </>
  );
};

export default AccountBookListPage;

const SC = {
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin: 2rem 0 1rem;
  `,
  Footer: styled.div`
    width: 100%;
    height: 18rem;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Img: styled.img`
    width: 128px;
  `,
};
