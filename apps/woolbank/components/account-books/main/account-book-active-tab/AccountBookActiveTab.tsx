'use client';

import { Suspense } from '@wds';
import { AccountBookCalendar } from '../account-book-calendar/AccountBookCalendar';
import AccountBookList from '../account-list/account-book-list/AccountBookList';
import { useAccountBookListRouterQuery } from '../_common/hooks/useAccountBookListRouterQuery';

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
