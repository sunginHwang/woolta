'use client';

import { withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import type { ISODate } from '@wds';
import { toIsoDate } from '@woolta/woolbank-features';
import { useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUserInfo } from '../../../hooks/queries/useUserInfo';
import { toKstDateString } from '../../../utils/date';
import { useAccountBookList } from './_common/hooks/useAccountBookList';
import { useSelectedDay } from './_common/hooks/useSelectedDay';
import { selectedAccountBookDateAtom } from './_common/stores/accountbookDate';
import { DailyList } from './daily-list/DailyList';
import { DaySheet } from './day-sheet/DaySheet';
import { HomeCalendar } from './home-calendar/HomeCalendar';
import { HomeTopbar } from './home-topbar/HomeTopbar';
import { MonthSummary } from './month-summary/MonthSummary';
import { MonthSummarySkeleton } from './month-summary/MonthSummarySkeleton';
import { WeeklyBudgetCard } from './weekly-budget/WeeklyBudgetCard';

const styles = stylex.create({
  main: {
    paddingBottom: '2rem',
  },
});

interface OverviewProps {
  month: string;
  today: ISODate;
  selectedDay: ISODate;
  onSelectDay: (date: ISODate) => void;
}

/** 요약 + 달력 + 날짜 시트 — 같은 목록 쿼리를 쓰므로 한 Suspense 경계에 둔다 */
const Overview = ({ month, today, selectedDay, onSelectDay }: OverviewProps) => {
  const router = useRouter();
  const { isShareUser } = useUserInfo();
  const { accountBookListGroupByDay } = useAccountBookList();
  const [expanded, setExpanded] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const selectedItems =
    accountBookListGroupByDay.find((group) => toIsoDate(month, group.days) === selectedDay)?.accountBookList ?? [];

  const handleSelectDate = (date: ISODate) => {
    onSelectDay(date);
    setIsSheetOpen(true);
  };

  return (
    <>
      <MonthSummary />
      <WeeklyBudgetCard />
      <HomeCalendar
        month={month}
        today={today}
        selectedDate={selectedDay}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onSelectDate={handleSelectDate}
      />
      <DaySheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        date={selectedDay}
        items={selectedItems}
        canAdd={!isShareUser}
        onAddClick={() => router.push(`/account-books/save?date=${selectedDay}`)}
      />
    </>
  );
};

const SuspendedOverview = withSuspense(Overview, <MonthSummarySkeleton />);

/**
 * 가계부 홈 — 월 이동 상단바 · 이달 요약 · 주간 예산 · 주 달력 · 일별 리스트.
 * @component
 */
const AccountBookHomePage = () => {
  const month = useAtomValue(selectedAccountBookDateAtom);
  // 서버와 브라우저의 "오늘"이 어긋나지 않도록 KST 날짜로 고정한다
  const today = toKstDateString();
  const { selectedDay, setSelectedDay } = useSelectedDay(month, today);

  return (
    <>
      <HomeTopbar />
      <main {...stylex.props(styles.main)}>
        <SuspendedOverview month={month} today={today} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        <DailyList />
      </main>
    </>
  );
};

export default AccountBookHomePage;
