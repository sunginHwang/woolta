'use client';

import { useToggle, withSuspense } from '@common';
import { Text } from '@wds';
import dayjs, { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { styled } from 'styled-components';
import BotttomSheet from '../../../../../components/BotttomSheet';
import { BottomMenu } from '../../../../../components/BotttomSheet/MenuSheet';
import DropdownTitle from '../../../../../components/DropdownTitle';
import { useAccountBookList } from '../../_common/hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../_common/stores/accountbookDate';
import Skeleton from './Skeleton';

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
      <SC.Container>
        <DropdownTitle
          title={titleMsg}
          onNextMonthClick={handleNextMonthClick}
          onPrevMonthClick={handlePrevMonthClick}
          onClick={openMonthPicker}
        />
        <SC.TotalSection>
          <div className='item'>
            <Text variant='body3' color='gray600' mt={5} as='p'>
              지출
            </Text>
            <Text variant='title4Bold' color='red500' mt={5} as='p'>
              {totalExpenditureAmount.toLocaleString('ko-KR')}원
            </Text>
          </div>
          <div className='item'>
            <Text variant='body3' color='gray600' mt={5} as='p'>
              수입
            </Text>
            <Text variant='title4Bold' color='graySecondary' mt={5} as='p'>
              {totalIncomeAmount.toLocaleString('ko-KR')}원
            </Text>
          </div>
        </SC.TotalSection>
      </SC.Container>
      <BotttomSheet.Menu
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

const SC = {
  Container: styled.header`
    padding: 1rem 1.6rem 0;
  `,
  TotalSection: styled.section`
    margin-top: 1.6rem;

    .item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
  `,
};

export default withSuspense(MonthStatistics, <Skeleton />);
