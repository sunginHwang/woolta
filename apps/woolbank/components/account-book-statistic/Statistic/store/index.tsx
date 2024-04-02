import dayjs, { Dayjs } from 'dayjs';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { DateRange } from '../../../../utils/date';
export type AccountBookCategoryType = 'expenditure' | 'income';

export interface AccountStatisticFilter {
  startDate: Dayjs;
  endDate: Dayjs;
  type: AccountBookCategoryType;
  dateRange: DateRange;
}
export const AccountBookStatisticFilterAtom = atom<AccountStatisticFilter>({
  startDate: dayjs('2024-01-01 00:00:00'),
  endDate: dayjs('2024-01-31 23:59:59'),
  type: 'expenditure',
  dateRange: 'month',
});

export const allVisibilityStatisticAtom = atomWithStorage('allVisibilityStatistic', false);
