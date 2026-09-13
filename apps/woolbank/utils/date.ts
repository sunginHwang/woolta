import dayjs, { type Dayjs } from 'dayjs';

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

/**
 * KST 기준 날짜 문자열(YYYY-MM-DD).
 *
 * 렌더 중에 `new Date()` 를 그대로 쓰면 서버(호스트 타임존)와 브라우저(사용자 타임존)가
 * 다른 "오늘" 을 만들어 하이드레이션이 어긋난다. D-day 는 원래 날짜 단위 개념이므로
 * 양쪽이 같은 값을 내도록 KST 날짜로 고정한다.
 *
 * `toISOString()` 은 항상 UTC 라 호스트 타임존에 의존하지 않는다 — 여기에 KST 오프셋을 더한다.
 */
const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

export const toKstDateString = (value: Date | string | number = Date.now()): string =>
  new Date(new Date(value).getTime() + KST_OFFSET_MS).toISOString().slice(0, 10);

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

  return dayjs(endDay).diff(dayjs(startDay), 'day');
};

/* 시작일 ~ 종료일까지의 퍼센티지 구하기 */
export const getRemainDatePercentage = (
  startDay: Date | string,
  endDay: Date | string,
  today: Date | string = new Date(),
): number => {
  const totalDateCount = getRemainDays(startDay, endDay);
  const passDateCount = getRemainDays(startDay, today);
  const remainDate = (passDateCount / totalDateCount) * 100;

  const remainPercent = parseInt(remainDate.toString(), 10);

  if (isNaN(remainPercent)) {
    return 0;
  }

  return remainPercent > 100 ? 100 : remainPercent;
};
