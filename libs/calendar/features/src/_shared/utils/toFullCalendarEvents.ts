import type { EventInput } from '@fullcalendar/core';
import type { CalendarEvent } from '../types';
import { resolveEventBgTint, resolveEventColor, resolveEventTextColor } from './calendarEventColor';

/** FullCalendar 이벤트의 extendedProps — 렌더러/클릭 핸들러가 원본 정보를 되찾는 통로 */
export interface CalendarEventExtendedProps {
  isMine: boolean;
  ownerName: string;
}

/**
 * 서버 일정을 FullCalendar 이벤트로 옮긴다.
 *
 * - `end` 는 서버와 FullCalendar 둘 다 exclusive 라 변환 없이 그대로 넘긴다.
 * - 공유받은 일정은 `editable: false` 로 잠근다. 서버도 소유자만 쓰기를 허용하므로
 *   드래그가 가능해 보이면 실패하는 요청만 나간다.
 * - backgroundColor 는 은은한 틴트, borderColor 는 솔리드 색.
 *   CSS 가 공유 일정 좌측 바를 borderColor 에서 가져가므로 두 값을 분리한다.
 */
export const toFullCalendarEvents = (events: CalendarEvent[]): EventInput[] =>
  events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.startAt,
    end: event.endAt,
    allDay: event.isAllDay,
    editable: event.isMine,
    backgroundColor: resolveEventBgTint(event.color),
    borderColor: resolveEventColor(event.color),
    textColor: resolveEventTextColor(),
    // 공유받은 일정은 살짝 흐리게 — 내 일정과 구분이 필요하다
    classNames: event.isMine ? [] : ['woolta-shared-event'],
    extendedProps: {
      isMine: event.isMine,
      ownerName: event.owner.name,
    } satisfies CalendarEventExtendedProps,
  }));
