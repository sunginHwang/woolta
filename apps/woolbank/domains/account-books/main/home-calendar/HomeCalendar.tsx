'use client';

import type { ISODate } from '@wds';
import { toIsoDate } from '@woolta/woolbank-features';
import { useMemo } from 'react';
import { useAccountBookList } from '../_common/hooks/useAccountBookList';
import { type DayAmountMap, HomeCalendarView } from './HomeCalendarView';

interface Props {
  month: string;
  selectedDate: ISODate;
  today: ISODate;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  onSelectDate: (date: ISODate) => void;
}

/**
 * 달력 컨테이너 — 이달 목록의 일별 합계를 날짜 키 맵으로 바꿔 뷰에 넘긴다.
 * 리스트 그룹(`days`)과 같은 로컬 일 기준이라 ISO 를 다시 파싱하지 않는다.
 * @component
 */
export const HomeCalendar = ({ month, ...viewProps }: Props) => {
  const { accountBookListGroupByDay } = useAccountBookList();

  const dayAmounts = useMemo<DayAmountMap>(
    () =>
      Object.fromEntries(
        accountBookListGroupByDay.map((group) => [
          toIsoDate(month, group.days),
          { expense: group.expenditureAmount, income: group.incomeAmount },
        ]),
      ),
    [accountBookListGroupByDay, month],
  );

  return <HomeCalendarView month={month} dayAmounts={dayAmounts} {...viewProps} />;
};
