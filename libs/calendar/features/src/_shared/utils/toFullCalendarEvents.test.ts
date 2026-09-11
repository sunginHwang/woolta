import type { CalendarEvent } from '../types';
import { toFullCalendarEvents } from './toFullCalendarEvents';

const baseEvent: CalendarEvent = {
  id: 'event-1',
  title: '스프린트 회고',
  description: null,
  startAt: '2026-09-11T01:00:00.000Z',
  endAt: '2026-09-11T02:00:00.000Z',
  isAllDay: false,
  color: 'blue',
  isMine: true,
  owner: { id: 1, name: '나', email: 'me@woolta.com', profileImg: '' },
  createdAt: '2026-09-01T00:00:00.000Z',
  updatedAt: '2026-09-01T00:00:00.000Z',
};

describe('toFullCalendarEvents 테스트', () => {
  it('내 일정은 editable 로 변환된다.', () => {
    // Given
    // When
    const [event] = toFullCalendarEvents([baseEvent]);

    // Then
    expect(event.id).toBe('event-1');
    expect(event.editable).toBe(true);
    expect(event.classNames).toEqual([]);
  });

  it('공유받은 일정은 editable 이 false 이고 구분용 클래스가 붙는다.', () => {
    // Given
    const sharedEvent: CalendarEvent = {
      ...baseEvent,
      isMine: false,
      owner: { id: 2, name: '동료', email: 'peer@woolta.com', profileImg: '' },
    };

    // When
    const [event] = toFullCalendarEvents([sharedEvent]);

    // Then
    expect(event.editable).toBe(false);
    expect(event.classNames).toEqual(['woolta-shared-event']);
    expect(event.extendedProps).toMatchObject({ isMine: false, ownerName: '동료' });
  });

  it('start/end 는 변환 없이 그대로 넘긴다. (양쪽 모두 exclusive end 규약)', () => {
    // Given
    // When
    const [event] = toFullCalendarEvents([baseEvent]);

    // Then
    expect(event.start).toBe(baseEvent.startAt);
    expect(event.end).toBe(baseEvent.endAt);
  });

  it('알 수 없는 색 키는 기본색으로 떨어진다.', () => {
    // Given
    const unknownColor: CalendarEvent = { ...baseEvent, color: 'chartreuse' };

    // When
    const [fallback] = toFullCalendarEvents([unknownColor]);
    const [defaultColor] = toFullCalendarEvents([{ ...baseEvent, color: null }]);

    // Then
    expect(fallback.backgroundColor).toBe(defaultColor.backgroundColor);
  });
});
