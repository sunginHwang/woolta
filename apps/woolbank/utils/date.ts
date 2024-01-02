import dayjs from 'dayjs';

export const getRemainDay = (date: string | number, { completeMsg = 'd-day' }: { completeMsg: string }) => {
  const now = dayjs();
  const compareDay = dayjs(date);

  if (now.get('M') === compareDay.get('M') && now.get('d') === compareDay.get('d')) {
    return { remainDay: 0, remainDayKo: completeMsg };
  }

  const remainDay = now.diff(compareDay, 'D');

  return { remainDay, remainDayKo: remainDay > 7 ? compareDay.format('MM월 D') : `${remainDay}일 뒤` };
};
