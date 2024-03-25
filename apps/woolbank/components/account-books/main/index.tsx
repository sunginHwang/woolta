'use client';

import { Suspense } from '@wds';
import { useSearchParams } from 'next/navigation';
import { styled } from 'styled-components';
import AddButton from '../../common/AddButton';
import Tabs, { Tab } from '../../common/Tabs';
import { AccountBookCalendar } from './AccountBookCalendar';
import AccountBookList from './AccountList/AccountBookList';
import MonthStatistics from './AccountList/MonthStatistics';

const TAB_LIST: Tab[] = [
  { label: '리스트', value: 'list', link: '/?type=list' },
  { label: '캘린더', value: 'calendar', link: '/?type=calendar' },
];

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  const { get } = useSearchParams();
  const active_tab = get('type') ?? 'list';

  return (
    <>
      <Tabs tabs={TAB_LIST} value={active_tab} />
      <MonthStatistics />
      <SC.Line />
      {active_tab !== 'calendar' && <AccountBookList />}
      {active_tab === 'calendar' && (
        <Suspense fallback={<div></div>}>
          <AccountBookCalendar />
        </Suspense>
      )}
      <SC.Footer />
      <AddButton href='/account-books/save' />
    </>
  );
};

export default AccountBookListPage;

const SC = {
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin: 2rem 0 3rem;
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
