import { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { styled } from 'styled-components';
import { DateRange } from '../../../../utils/date';
import { AccountBookCategoryType, AccountBookStatisticFilterAtom } from '../_common/stores/statisticFilter';
import { CategoryOptionFilter } from './CategoryOptionFilter';
import { DateFilter } from './DateFilter';
import DateRangeFilter from './DateRangeFilter';
import TypeFilter from './TypeFilter';

/**
 * 가계부 통계 - 팝 영역
 * @component
 */
export const FilterInfo = () => {
  const [{ dateRange, startDate, endDate, type }, setAccountBookStatisticFilter] =
    useAtom(AccountBookStatisticFilterAtom);

  const setDate = (startDate: Dayjs, endDate: Dayjs) => {
    setAccountBookStatisticFilter((prev) => ({ ...prev, startDate, endDate }));
  };

  const setDateRange = ({
    startDate,
    endDate,
    dateRange,
  }: {
    startDate: Dayjs;
    endDate: Dayjs;
    dateRange: DateRange;
  }) => {
    setAccountBookStatisticFilter((prev) => ({ ...prev, dateRange, startDate, endDate }));
  };

  const setType = (type: AccountBookCategoryType) => {
    setAccountBookStatisticFilter((prev) => ({ ...prev, type }));
  };

  return (
    <SC.Container>
      <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      <SC.DateLabel>
        <DateFilter startDate={startDate} endDate={endDate} dateRange={dateRange} onDateChange={setDate} />
        <TypeFilter activeType={type} onTypeChange={setType} />
        <CategoryOptionFilter />
      </SC.DateLabel>
      <SC.Line />
    </SC.Container>
  );
};

const SC = {
  Container: styled.header`
    padding: 2rem 1.6rem 0;
  `,
  DateLabel: styled.div`
    margin: 2rem 0;
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;
    margin: 0 -1.6rem;
  `,
};
