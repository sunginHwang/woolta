import type {
  CalendarEventPartsFragment,
  CalendarSharePartsFragment,
  CalendarUserPartsFragment,
} from './api/gql.generated';

export type { CalendarShareStatus, RequestCalendarShareResultCode } from './api/gql.generated';

export type CalendarUser = CalendarUserPartsFragment;

/**
 * 일정. startAt/endAt 은 서버가 준 ISO 문자열 그대로 들고 있는다.
 * endAt 은 exclusive — 종일 일정 8/1 하루는 endAt = 8/2 00:00 (FullCalendar 종일 end 규약과 동일).
 */
export type CalendarEvent = CalendarEventPartsFragment;

export type CalendarShare = CalendarSharePartsFragment;

/** 캘린더 표시 방식 — FullCalendar 뷰 이름과 1:1 로 매핑된다 */
export type CalendarViewMode = 'month' | 'week' | 'day';
