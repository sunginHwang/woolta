'use client';

import { Suspense } from '@wds';
import { Text } from '@wds';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { styled } from 'styled-components';
import AddButton from '../../common/AddButton';
import { AccountBookCalendar } from './AccountBookCalendar';
import AccountBookList from './AccountList/AccountBookList';
import MonthStatistics from './AccountList/MonthStatistics';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';

const TAB_LIST = [
  { label: '리스트', value: 'list', link: '/?type=list' },
  { label: '캘린더', value: 'calendar', link: '/?type=calendar' },
];

/**
 * 가계부
 * @component
 */
const AccountBookListPage = () => {
  const { isShareUser } = useUserInfo();
  const { get } = useSearchParams();
  const active_tab = get('type') ?? 'list';

  return (
    <>
      <MonthStatistics />
      <SC.ToggleWrapper>
        <SC.ToggleTabs>
          {TAB_LIST.map((tab) => (
            <SC.Tab key={tab.label} active={active_tab === tab.value}>
              <Link replace href={tab.link}>
                <Text variant='title6Bold' color={active_tab === tab.value ? 'gray900' : 'gray500'} as='p'>
                  {tab.label}
                </Text>
              </Link>
            </SC.Tab>
          ))}
        </SC.ToggleTabs>
      </SC.ToggleWrapper>
      {active_tab !== 'calendar' && <AccountBookList />}
      {active_tab === 'calendar' && (
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
  ToggleWrapper: styled.section`
    margin-top: 1rem;
    padding: 8px 16px;
  `,
  ToggleTabs: styled.div`
    width: 100%;
    height: 4rem;
    display: flex;
    border-radius: 8px;
    flex-direction: row;
    background-color: ${({ theme }) => theme.colors.gray100};
  `,
  Footer: styled.div`
    width: 100%;
    height: 18rem;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Tab: styled.div<{ active?: boolean }>`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.gray100)};
    border-radius: 8px;
    margin: 2px;
  `,
  Img: styled.img`
    width: 128px;
  `,
};
