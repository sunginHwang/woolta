import dayjs, { Dayjs } from 'dayjs';
import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { DateRange } from '../../../../../utils/date';
export type AccountBookCategoryType = 'expenditure' | 'income';

export interface AccountStatisticFilter {
  startDate: Dayjs;
  endDate: Dayjs;
  type: AccountBookCategoryType;
  dateRange: DateRange;
}
export const AccountBookStatisticFilterAtom = atom<AccountStatisticFilter>({
  startDate: dayjs().startOf('month'),
  endDate: dayjs().endOf('month'),
  type: 'expenditure',
  dateRange: 'month',
});

export const allVisibilityStatisticAtom = atomWithStorage('allVisibilityStatistic', false);
