'use client';

import { withSuspense } from '@common';
import { useAtomValue } from 'jotai';
import { useAccountBookList } from '../_common/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../_common/stores/accountbookDate';
import { DailyListSkeleton } from './DailyListSkeleton';
import { DailyListView } from './DailyListView';

const DailyListContainer = () => {
  const month = useAtomValue(selectedAccountBookDateAtom);
  const { accountBookListGroupByDay } = useAccountBookList();

  return <DailyListView month={month} groups={accountBookListGroupByDay} />;
};

/**
 * 이달 일별 리스트 컨테이너
 * @component
 */
export const DailyList = withSuspense(DailyListContainer, <DailyListSkeleton />);
