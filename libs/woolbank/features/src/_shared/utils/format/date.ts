import dayjs, { type Dayjs } from 'dayjs';

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 가계부 날짜 헤더 — "11월 6일 금요일".
 * dayjs 전역 로케일을 바꾸지 않으려고 요일은 직접 붙인다(다른 포맷 호출에 영향 없음).
 */
export const formatDayTitle = (date: string | Date | Dayjs) => {
  const d = dayjs(date);

  if (!d.isValid()) {
    return '';
  }

  return `${d.month() + 1}월 ${d.date()}일 ${WEEKDAY_KO[d.day()]}요일`;
};

/** 달력의 주 합계 행 라벨 — 0 부터 세는 인덱스를 "1주차" 로 */
export const formatWeekLabel = (weekIndex: number) => `${weekIndex + 1}주차`;

/** 'YYYY-MM' 과 일(day) 로 'YYYY-MM-DD' 를 만든다. 리스트 그룹 키(`days`)와 달력 셀 키를 맞출 때 쓴다 */
export const toIsoDate = (month: string, day: number | string) => `${month}-${String(day).padStart(2, '0')}`;
