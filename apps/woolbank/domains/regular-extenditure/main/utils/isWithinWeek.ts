import dayjs, { type Dayjs } from 'dayjs';

const WEEK_DAYS = 7;

/**
 * 오늘부터 7일 안(오늘 포함, 7일 뒤 포함)에 빠져나가는 이체인지.
 * 예전 `isOneWeekRemain` 은 `now.diff(day)` 로 부호가 뒤집혀 지난 이체가 잡혔다 — 날짜 단위로 `day − today` 를 센다.
 */
export const isWithinWeek = (regularExpenditureDay: string | Date | Dayjs, now: Dayjs = dayjs()) => {
  const diff = dayjs(regularExpenditureDay).startOf('day').diff(now.startOf('day'), 'day');

  return diff >= 0 && diff <= WEEK_DAYS;
};
