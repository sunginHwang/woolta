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
