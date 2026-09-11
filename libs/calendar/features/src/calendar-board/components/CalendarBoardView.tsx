'use client';

import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useEffect, useMemo, useRef } from 'react';
import { useUpdateCalendarEvent } from '../../_shared/hooks/useCalendarEventMutations';
import { useCalendarEvents } from '../../_shared/hooks/useCalendarEvents';
import { useCalendarStore } from '../../_shared/stores/useCalendarStore';
import { FULL_CALENDAR_VIEW, getCalendarRange } from '../../_shared/utils/calendarRange';
import { toFullCalendarEvents } from '../../_shared/utils/toFullCalendarEvents';
import calendarCss from '../calendarBoard.module.css';

/** 주·일 뷰의 세로 스크롤 시작 지점 — 새벽부터 보여주면 대부분 빈 화면이다 */
const SCROLL_TIME = '08:00:00';

/**
 * FullCalendar 본체.
 *
 * 네비게이션(뷰·기준 날짜)의 단일 소유자는 store 다. FullCalendar 자체 툴바를 끄고(headerToolbar: false)
 * store 변화를 imperative API 로 밀어 넣는다 — 양쪽이 각자 상태를 들면 조회 범위와 화면이 어긋난다.
 *
 * 상위가 baseDateIso 가 채워진 뒤에만 이 컴포넌트를 마운트한다(SSR·하이드레이션 회피).
 */
export const CalendarBoardView = () => {
  const calendarRef = useRef<FullCalendar>(null);

  const viewMode = useCalendarStore((state) => state.viewMode);
  const baseDateIso = useCalendarStore((state) => state.baseDateIso);
  const openNewEvent = useCalendarStore((state) => state.openNewEvent);
  const openEvent = useCalendarStore((state) => state.openEvent);

  const range = useMemo(() => getCalendarRange(viewMode, baseDateIso), [viewMode, baseDateIso]);
  const events = useCalendarEvents(range);
  const { updateEvent } = useUpdateCalendarEvent();

  const fullCalendarEvents = useMemo(() => toFullCalendarEvents(events), [events]);

  // store → FullCalendar 단방향 동기화
  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) {
      return;
    }

    const nextView = FULL_CALENDAR_VIEW[viewMode];
    if (api.view.type !== nextView) {
      api.changeView(nextView);
    }
    api.gotoDate(baseDateIso);
  }, [viewMode, baseDateIso]);

  /** 빈 칸을 드래그/클릭하면 그 구간으로 새 일정 편집을 연다 */
  const handleSelect = (arg: DateSelectArg) => {
    openNewEvent({ startAt: arg.start.toISOString(), endAt: arg.end.toISOString(), isAllDay: arg.allDay });
    arg.view.calendar.unselect();
  };

  /** 공유받은 일정은 읽기 전용 — 편집창을 열지 않는다 */
  const handleEventClick = (arg: EventClickArg) => {
    if (arg.event.extendedProps.isMine !== true) {
      return;
    }
    openEvent(arg.event.id);
  };

  /**
   * 드래그 이동 / 리사이즈 — 낙관적 갱신을 하지 않고 서버 응답 후 무효화로 반영한다.
   * 실패 시 FullCalendar 가 잡고 있는 위치를 되돌려야 하므로 revert 를 호출한다.
   */
  const handleEventChange = async (
    arg: EventDropArg | Parameters<NonNullable<React.ComponentProps<typeof FullCalendar>['eventResize']>>[0],
  ) => {
    const { event } = arg;

    if (event.start === null) {
      arg.revert();
      return;
    }

    try {
      await updateEvent({
        id: event.id,
        startAt: event.start.toISOString(),
        // 종일 한 칸으로 옮기면 end 가 비는데, 서버는 exclusive end 를 요구한다
        endAt: (event.end ?? new Date(event.start.getTime() + 3_600_000)).toISOString(),
        isAllDay: event.allDay,
      });
    } catch {
      arg.revert();
    }
  };

  return (
    <div className={calendarCss.board}>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={koLocale}
        initialView={FULL_CALENDAR_VIEW[viewMode]}
        initialDate={baseDateIso}
        headerToolbar={false}
        height='100%'
        events={fullCalendarEvents}
        // 드래그로 구간 선택 + 기존 일정 드래그/리사이즈
        selectable
        selectMirror
        editable
        dayMaxEvents
        nowIndicator
        // 기본값은 월 뷰의 시간 지정 일정을 dot 으로 그려 backgroundColor 를 무시한다.
        // block 이라야 틴트 pill 이 적용된다.
        eventDisplay='block'
        // 한국어 로케일은 "30일" 처럼 접미사가 붙어 원형 배지 안에서 줄바꿈된다. 숫자만 남긴다.
        dayCellContent={(arg) => arg.dayNumberText.replace('일', '')}
        scrollTime={SCROLL_TIME}
        slotDuration='00:30:00'
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
      />
    </div>
  );
};
