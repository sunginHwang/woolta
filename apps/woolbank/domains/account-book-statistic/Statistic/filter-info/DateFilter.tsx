import { useToggle } from '@common';
import dayjs, { Dayjs } from 'dayjs';
import { DateRange, getDateRange } from '../../../../utils/date';
import BotttomSheet from '../../../common/BotttomSheet';
import { BottomMenu } from '../../../common/BotttomSheet/MenuSheet';
import { Label } from './Label';

interface Props {
  startDate: Dayjs;
  endDate: Dayjs;
  dateRange: DateRange;
  onDateChange: (startDate: Dayjs, endDate: Dayjs) => void;
}

/**
 * 가계부 레이블 필터 - 날짜 영역
 * @component
 */

export const DateFilter = ({ startDate, endDate, dateRange, onDateChange }: Props) => {
  const [isOpenModal, toggleModal] = useToggle();

  const onDateModalClick = (date: string) => {
    const [startDate, endDate] = getDateRange(dateRange, dayjs(date));
    toggleModal();
    onDateChange(startDate, endDate);
  };

  const fiveYearMonthBottomMenuList = getFiveYearMonthBottomMenuList();
  const labelText = getDateFilterText(dateRange, startDate, endDate);
  const tenYearList = get10YearBottomMenuList();

  return (
    <>
      <Label text={labelText} onClick={() => toggleModal()} />
      <BotttomSheet.Menu
        title='월 선택하기'
        menus={fiveYearMonthBottomMenuList}
        activeMenuType={startDate.format('YYYY-MM')}
        visible={isOpenModal && dateRange === 'month'}
        oncloseModal={toggleModal}
        onEditClick={onDateModalClick}
      />
      <BotttomSheet.Menu
        title='년도 선택하기'
        menus={tenYearList}
        activeMenuType={startDate.format('YYYY')}
        visible={isOpenModal && dateRange === 'year'}
        oncloseModal={toggleModal}
        onEditClick={onDateModalClick}
      />
      <BotttomSheet.Date
        visible={isOpenModal && dateRange === 'week'}
        onclose={toggleModal}
        onDateChange={onDateModalClick}
        date={startDate.toDate()}
      />
    </>
  );
};

function getDateFilterText(dateRangeType: DateRange, startDate: Dayjs, endDate: Dayjs) {
  return {
    week: `${startDate.format('YYYY-MM-DD')} ~ ${endDate.format('YYYY-MM-DD')}`,
    month: startDate.format('YYYY년 MM월'),
    year: startDate.format('YYYY년'),
  }[dateRangeType];
}

function get10YearBottomMenuList(): BottomMenu[] {
  const now = dayjs();
  const nowYear = now.get('year');

  return [...Array(10)].map((_, key) => {
    const year = nowYear - key;
    return {
      type: String(year),
      value: `${year}년`,
    };
  });
}

/**
 * 5년 동안의 날짜 리스트 조회
 */
function getFiveYearMonthBottomMenuList(): BottomMenu[] {
  const now = dayjs();
  const month5Years = 60;

  return [...Array(month5Years)].map((_, index) => {
    const month = now.add(-index, 'month');

    return {
      type: month.format('YYYY-MM'),
      value: month.format('YYYY년 MM월'),
    };
  });
}
