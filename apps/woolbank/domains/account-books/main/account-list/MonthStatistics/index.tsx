'use client';

import { useToggle, withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import dayjs, { type Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { BottomSheet } from '../../../../../components/bottom-sheet/BottomSheet';
import type { BottomMenu } from '../../../../../components/bottom-sheet/menu-sheet/MenuSheet';
import { DropdownTitle } from '../../../../../components/dropdown-title/DropdownTitle';
import { useAccountBookList } from '../../_common/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../_common/stores/accountbookDate';
import Skeleton from './Skeleton';

const MONTH_FOR_5_YEAR = 60;

const styles = stylex.create({
  container: {
    paddingTop: '1rem',
    paddingInline: '1.6rem',
    paddingBottom: 0,
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
            <Text variant='body3' color='gray600' mt={5} as='p'>
              지출
            </Text>
            <Text variant='title4Bold' color='red500' mt={5} as='p'>
              {totalExpenditureAmount.toLocaleString('ko-KR')}원
            </Text>
          </div>
          <div {...stylex.props(styles.item)}>
            <Text variant='body3' color='gray600' mt={5} as='p'>
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

export default withSuspense(MonthStatistics, <Skeleton />);
