'use client';

import { useToggle, withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import dayjs, { type Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { BottomSheet } from '../_shared/bottom-sheet/BottomSheet';
import type { BottomMenu } from '../_shared/bottom-sheet/menu-sheet/MenuSheet';
import { DropdownTitle } from '../_shared/components/dropdown-title/DropdownTitle';
import { useAccountBookList } from '../_shared/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../_shared/stores/accountbookDate';
import MonthStatisticsSkeleton from './MonthStatisticsSkeleton';

const MONTH_FOR_5_YEAR = 60;

/**
 * 이달의 가계부 통계 영역
 * @component
 */
const MonthStatistics = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedAccountBookDateAtom);
  const { totalExpenditureAmount, totalIncomeAmount } = useAccountBookList();
  const [isOpenMonthPicker, setToggleMonthPicker] = useToggle(false);
  const openMonthPicker = () => setToggleMonthPicker(true);
  const closeMonthPicker = () => setToggleMonthPicker(false);

  const fiveYearMonthList: BottomMenu[] = useMemo(() => {
    return [...Array(MONTH_FOR_5_YEAR)].map((_, index) => getMonthMenu(dayjs().add(-index, 'month')));
  }, []);

  const onMonthClick = (month: string) => {
    setSelectedDate(month);
    closeMonthPicker();
  };

  const handlePrevMonthClick = () => {
    setSelectedDate(dayjs(selectedDate).subtract(1, 'month').format('YYYY-MM'));
  };

  const handleNextMonthClick = () => {
    setSelectedDate(dayjs(selectedDate).add(1, 'month').format('YYYY-MM'));
  };

  const titleMsg = useMemo(() => getTitleMsg(selectedDate), [selectedDate]);
  const activeMonthMenu = getMonthMenu(dayjs(selectedDate));

  return (
    <>
      <header {...stylex.props(styles.container)}>
        <DropdownTitle
          title={titleMsg}
          onNextMonthClick={handleNextMonthClick}
          onPrevMonthClick={handlePrevMonthClick}
          onClick={openMonthPicker}
        />
        <section {...stylex.props(styles.totalSection)}>
          <div {...stylex.props(styles.item)}>
            <Text variant='body3' color='textTertiary' mt={5} as='p'>
              지출
            </Text>
            <Text variant='title4Bold' color='statusError' mt={5} as='p'>
              {totalExpenditureAmount.toLocaleString('ko-KR')}원
            </Text>
          </div>
          <div {...stylex.props(styles.item)}>
            <Text variant='body3' color='textTertiary' mt={5} as='p'>
              수입
            </Text>
            <Text variant='title4Bold' color='graySecondary' mt={5} as='p'>
              {totalIncomeAmount.toLocaleString('ko-KR')}원
            </Text>
          </div>
        </section>
      </header>
      <BottomSheet.Menu
        title='월 선택하기'
        menus={fiveYearMonthList}
        activeMenuType={activeMonthMenu.type}
        visible={isOpenMonthPicker}
        oncloseModal={closeMonthPicker}
        onEditClick={onMonthClick}
      />
    </>
  );
};

function getMonthMenu(month: Dayjs) {
  return {
    type: month.format('YYYY-MM'),
    value: month.format('YYYY년 M월'),
  };
}

function getTitleMsg(selectedDate: string) {
  return dayjs().isSame(dayjs(selectedDate), 'year')
    ? `${dayjs(selectedDate).format('M월')}`
    : `${dayjs(selectedDate).format('YYYY년 M월')}`;
}

export default withSuspense(MonthStatistics, <MonthStatisticsSkeleton />);

const styles = stylex.create({
  container: {
    paddingTop: '1rem',
    paddingBottom: 0,
    paddingInline: '1.6rem',
  },
  totalSection: {
    marginTop: '1.6rem',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
});
