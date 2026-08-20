'use client';

import { Suspense } from '@wds';
import { useAccountBookListRouterQuery } from '../_shared/hooks/useAccountBookListRouterQuery';
import { AccountBookCalendar } from './AccountBookCalendar';
import AccountBookList from './AccountBookList';

/**
 * 가계부 탭 활성화 뷰 (리스트 / 달력)
 * @component
 */
export const AccountBookActiveTab = () => {
  const { activeTab } = useAccountBookListRouterQuery();

  return (
    <>
      {activeTab !== 'calendar' && <AccountBookList />}
      {activeTab === 'calendar' && (
        <Suspense fallback={<div />}>
          <AccountBookCalendar />
        </Suspense>
      )}
    </>
  );
};
