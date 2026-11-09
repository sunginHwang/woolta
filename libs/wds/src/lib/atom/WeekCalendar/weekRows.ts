/** 'YYYY-MM-DD' */
export type ISODate = string;

export interface WeekCalendarWeek {
  /** 0 부터 세는 주 인덱스(달력 행 순서) */
  index: number;
  /** 7개. 달 밖의 날짜(앞뒤 달)도 들어 있다 */
  dates: ISODate[];
}

const pad = (n: number) => String(n).padStart(2, '0');

/** UTC 기준 Date → 'YYYY-MM-DD'. 호스트 타임존에 영향받지 않도록 모든 계산은 UTC 로 한다 */
const toIso = (date: Date): ISODate =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;

const parseMonth = (month: string) => {
  const [year, monthIndex] = month.split('-').map(Number);

  return { year, monthIndex: monthIndex - 1 };
};

/** 'YYYY-MM-DD' 를 UTC 자정 Date 로 */
export const parseIsoDate = (date: ISODate) => {
  const [year, month, day] = date.split('-').map(Number);

  return new Date(Date.UTC(year, month - 1, day));
};

/** 날짜 문자열에 일 수를 더한다 */
export const addDays = (date: ISODate, days: number): ISODate => {
  const d = parseIsoDate(date);
  d.setUTCDate(d.getUTCDate() + days);

  return toIso(d);
};

export const isSameMonth = (date: ISODate, month: string) => date.startsWith(`${month}-`);

/**
 * 한 달을 주 단위 행으로 자른다. 첫 행은 그 달 1일이 속한 주, 마지막 행은 말일이 속한 주.
 * 일요일 시작(0)이면 4~6행, 월요일 시작(1)도 같다.
 */
export const getWeekRows = (month: string, weekStartsOn: 0 | 1 = 0): WeekCalendarWeek[] => {
  const { year, monthIndex } = parseMonth(month);
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const offset = (first.getUTCDay() - weekStartsOn + 7) % 7;

  const cursor = new Date(first);
  cursor.setUTCDate(1 - offset);

  const rows: WeekCalendarWeek[] = [];

  while (true) {
    const dates: ISODate[] = [];

    for (let i = 0; i < 7; i += 1) {
      dates.push(toIso(cursor));
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }

    rows.push({ index: rows.length, dates });

    const rowStart = parseIsoDate(dates[0]);
    const nextRowStartsAfterMonth =
      cursor.getUTCMonth() !== monthIndex || cursor.getUTCFullYear() !== year || rowStart.getUTCDate() > lastDay;

    if (nextRowStartsAfterMonth && !isSameMonth(toIso(cursor), month)) {
      break;
    }
  }

  return rows;
};

/** date 가 들어 있는 행 인덱스. 없으면 -1 */
export const findWeekIndex = (rows: WeekCalendarWeek[], date: ISODate | undefined) =>
  date ? rows.findIndex((row) => row.dates.includes(date)) : -1;

/** 날짜 문자열에서 '일' 숫자만 */
export const getDayOfMonth = (date: ISODate) => Number(date.slice(8, 10));

/** 달력 셀 aria-label 용 — "11월 6일" */
export const formatDateLabel = (date: ISODate) => `${Number(date.slice(5, 7))}월 ${getDayOfMonth(date)}일`;
