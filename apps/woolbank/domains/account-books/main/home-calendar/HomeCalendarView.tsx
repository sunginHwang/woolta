'use client';

import * as stylex from '@stylexjs/stylex';
import { type ISODate, WeekCalendar, type WeekCalendarWeek } from '@wds';
import { type DayAmount, DayMeta } from './DayMeta';
import { WeekSummaryRow } from './WeekSummaryRow';

/** 'YYYY-MM-DD' → 그날의 지출·수입 합 */
export type DayAmountMap = Record<ISODate, DayAmount>;

export interface HomeCalendarViewProps {
  month: string;
  selectedDate: ISODate;
  today?: ISODate;
  expanded: boolean;
  dayAmounts: DayAmountMap;
  onExpandedChange: (expanded: boolean) => void;
  onSelectDate: (date: ISODate) => void;
}

const styles = stylex.create({
  root: {
    paddingTop: '1.6rem',
    paddingBottom: '0.4rem',
  },
});

const sumWeek = (week: WeekCalendarWeek, dayAmounts: DayAmountMap) =>
  week.dates.reduce(
    (acc, date) => {
      const amount = dayAmounts[date];
      if (amount) {
        acc.expense += amount.expense;
        acc.income += amount.income;
      }
      return acc;
    },
    { expense: 0, income: 0 },
  );

/**
 * 가계부 홈 달력 — wds WeekCalendar 에 일별 금액 축약과 주 합계 행을 붙인 뷰.
 * 데이터는 props 로 받아 스토리에서 고정할 수 있다.
 * @component
 */
export const HomeCalendarView = ({
  month,
  selectedDate,
  today,
  expanded,
  dayAmounts,
  onExpandedChange,
  onSelectDate,
}: HomeCalendarViewProps) => (
  <WeekCalendar
    month={month}
    selectedDate={selectedDate}
    today={today}
    expanded={expanded}
    onExpandedChange={onExpandedChange}
    onSelectDate={onSelectDate}
    renderDayMeta={(date, { isOutsideMonth }) => (isOutsideMonth ? null : <DayMeta {...dayAmounts[date]} />)}
    renderWeekSummary={(week) => {
      const { expense, income } = sumWeek(week, dayAmounts);

      return expense > 0 ? <WeekSummaryRow weekIndex={week.index} expense={expense} income={income} /> : null;
    }}
    xstyle={styles.root}
  />
);
