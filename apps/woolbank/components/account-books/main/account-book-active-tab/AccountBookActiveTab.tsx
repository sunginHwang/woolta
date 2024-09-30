'use client';

import { Suspense } from '@wds';
import { styled } from 'styled-components';
import { useAccountBookListRouterQuery } from '../hooks/useAccountBookListRouterQuery';
import AccountBookList from '../AccountList/AccountBookList';
import { AccountBookCalendar } from '../AccountBookCalendar';

/**
 * 가계부
 * @component
 */
export const AccountBookActiveTab = () => {
  const { activeTab } = useAccountBookListRouterQuery();

  return (
    <>
      {activeTab !== 'calendar' && <AccountBookList />}
      {activeTab === 'calendar' && (
        <Suspense fallback={<div></div>}>
          <AccountBookCalendar />
        </Suspense>
      )}
    </>
  );
};

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
