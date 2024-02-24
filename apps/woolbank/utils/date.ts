import dayjs, { Dayjs } from 'dayjs';

export const getRemainDay = (date: string | number, { completeMsg = 'd-day' }: { completeMsg: string }) => {
  const resetHours = (date: Dayjs) => date.hour(0).minute(0).second(0).millisecond(0);

  const now = resetHours(dayjs());
  const compareDay = resetHours(dayjs(date));

  if (now.get('M') === compareDay.get('M') && now.get('d') === compareDay.get('d')) {
    return { remainDay: 0, remainDayKo: completeMsg };
  }

  const remainDay = Math.abs(now.diff(compareDay, 'day'));
  return { remainDay, remainDayKo: remainDay > 7 ? compareDay.format('MM월 D일') : `${remainDay}일 뒤` };
};

export type DateRange = 'month' | 'week' | 'year';

// 년, 월, 주 단위 날짜 최소, 최대 범위 계산
export function getDateRange(rangeType: DateRange, date?: Dayjs | undefined) {
  const rangeDate = date ?? dayjs();

  return [rangeDate.startOf(rangeType), rangeDate.endOf(rangeType)];
}

/*
 * 남은 일자를 구해준다. 시작일이 종료일 보다 클경우 남은 날짜는 x
 * */
export const getRemainDays = (startDay: Date | string, endDay: Date | string): number => {
  if (!startDay || !endDay) {
    return 0;
  }

  const firstTime = new Date(startDay).getTime();
  const secondTime = new Date(endDay).getTime();

  if (firstTime >= secondTime) {
    return 0;
  }

  return dayjs(startDay).diff(dayjs(endDay));
};
