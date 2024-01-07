import { useToggle } from '@common';
import styled from '@emotion/styled';
import { Text } from '@wds';
import dayjs, { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import BotttomSheet from '../../../common/BotttomSheet';
import { BottomMenu } from '../../../common/BotttomSheet/MenuSheet';
import DropdownTitle from '../../../common/DropdownTitle';
import { useAccountBookList } from '../hooks/useAccountBookList';
import { selectedAccountBookDateAtom } from '../store';

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

  const titleMsg = useMemo(() => getTitleMsg(selectedDate), [selectedDate]);
  const monthLabelPrefix = useMemo(() => getMonthLabelPrefix(selectedDate), [selectedDate]);
  const activeMonthMenu = getMonthMenu(dayjs(selectedDate));

  return (
    <>
      <SC.Container>
        <DropdownTitle title={titleMsg} onClick={openMonthPicker} />
        <SC.TotalSection>
          <Text variant='small1Medium' color='gray500' as='p'>
            {monthLabelPrefix}
          </Text>
          <Text variant='title6Bold' color='red500' mt={5} as='p'>
            지출 : {totalExpenditureAmount.toLocaleString('ko-KR')}원
          </Text>
          <Text variant='title6Bold' color='graySecondary' mt={5} as='p'>
            수입 : {totalIncomeAmount.toLocaleString('ko-KR')}원
          </Text>
        </SC.TotalSection>
      </SC.Container>
      <SC.Line />
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
  const subFix = '소비 내역';

  return dayjs().isSame(dayjs(selectedDate), 'year')
    ? `${dayjs(selectedDate).format('M월')} ${subFix}`
    : `${dayjs(selectedDate).format('YYYY년 M월')} ${subFix}`;
}

function getMonthLabelPrefix(selectedDate: string) {
  const isCurrentYearOfMonth =
    dayjs().isSame(dayjs(selectedDate), 'month') && dayjs().isSame(dayjs(selectedDate), 'year');
  const subFix = '지출 / 수입 내역';
  return isCurrentYearOfMonth ? `오늘까지 ${subFix}` : `${dayjs().format('M월')} ${subFix}`;
}

const SC = {
  Container: styled.div`
    padding-top: 2rem;
  `,
  TotalSection: styled.section`
    margin-top: 2rem;
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin-top: 2rem;
  `,
};

export default MonthStatistics;
