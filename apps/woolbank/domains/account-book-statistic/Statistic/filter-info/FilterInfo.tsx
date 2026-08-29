import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { Dayjs } from 'dayjs';
import { useAtom } from 'jotai';
import { DateRange } from '../../../../utils/date';
import { AccountBookCategoryType, AccountBookStatisticFilterAtom } from '../_common/stores/statisticFilter';
import { CategoryOptionFilter } from './CategoryOptionFilter';
import { DateFilter } from './DateFilter';
import DateRangeFilter from './DateRangeFilter';
import TypeFilter from './TypeFilter';

const styles = stylex.create({
  container: {
    paddingTop: '2rem',
    paddingInline: '1.6rem',
    paddingBottom: 0,
  },
  dateLabel: {
    marginBlock: '2rem',
    marginInline: 0,
  },
  line: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginBlock: 0,
    marginInline: '-1.6rem',
  },
});

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
    <header {...stylex.props(styles.container)}>
      <DateRangeFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
      <div {...stylex.props(styles.dateLabel)}>
        <DateFilter startDate={startDate} endDate={endDate} dateRange={dateRange} onDateChange={setDate} />
        <TypeFilter activeType={type} onTypeChange={setType} />
        <CategoryOptionFilter />
      </div>
      <div {...stylex.props(styles.line)} />
    </header>
  );
};
