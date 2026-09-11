import dayjs from 'dayjs';
import type { CalendarViewMode } from '../types';

/** FullCalendar 뷰 이름 — CalendarViewMode 와 1:1 */
export const FULL_CALENDAR_VIEW: Record<CalendarViewMode, string> = {
  month: 'dayGridMonth',
  week: 'timeGridWeek',
  day: 'timeGridDay',
};

export interface CalendarRange {
  /** 조회 시작 (inclusive, ISO) */
  startAt: string;
  /** 조회 끝 (exclusive, ISO) */
  endAt: string;
}

/**
 * 뷰와 기준 날짜로 조회 범위를 만든다.
 *
 * 월 뷰는 달의 첫 주 일요일부터 마지막 주 토요일까지 6주가 그려지므로, 달 경계가 아니라
 * **주 경계까지 넓혀** 받아야 앞뒤 달에서 넘어온 칸이 빈 채로 남지 않는다.
 * 기준 날짜와 범위를 한곳에서 계산해 queryKey 가 흔들리지 않게 한다.
 */
export const getCalendarRange = (viewMode: CalendarViewMode, baseDateIso: string): CalendarRange => {
  const base = dayjs(baseDateIso);

  if (viewMode === 'day') {
    return { startAt: base.startOf('day').toISOString(), endAt: base.add(1, 'day').startOf('day').toISOString() };
  }

  if (viewMode === 'week') {
    const start = base.startOf('week');
    return { startAt: start.toISOString(), endAt: start.add(1, 'week').toISOString() };
  }

  const start = base.startOf('month').startOf('week');
  const end = base.endOf('month').endOf('week').add(1, 'millisecond');
  return { startAt: start.toISOString(), endAt: end.toISOString() };
};

/** 헤더에 띄우는 기간 라벨 */
export const formatRangeLabel = (viewMode: CalendarViewMode, baseDateIso: string) => {
  const base = dayjs(baseDateIso);

  if (viewMode === 'day') {
    return base.format('YYYY년 M월 D일');
  }
  if (viewMode === 'week') {
    const start = base.startOf('week');
    const end = start.add(6, 'day');
    return start.isSame(end, 'month')
      ? `${start.format('YYYY년 M월 D일')} – ${end.format('D일')}`
      : `${start.format('YYYY년 M월 D일')} – ${end.format('M월 D일')}`;
  }
  return base.format('YYYY년 M월');
};

/** 이전/다음 이동 단위는 뷰에 따라 다르다 */
export const shiftBaseDate = (viewMode: CalendarViewMode, baseDateIso: string, direction: 1 | -1) => {
  const unit = viewMode === 'month' ? 'month' : viewMode === 'week' ? 'week' : 'day';
  return dayjs(baseDateIso).add(direction, unit).toISOString();
};
