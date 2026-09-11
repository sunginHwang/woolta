import dayjs from 'dayjs';
import { getCalendarRange, shiftBaseDate } from './calendarRange';

// 2026-09-11 (금) 기준
const BASE = '2026-09-11T13:20:00.000Z';

describe('getCalendarRange 테스트', () => {
  describe('일 뷰 테스트', () => {
    it('기준 날짜의 하루(00:00 ~ 다음날 00:00)를 반환한다.', () => {
      // Given
      // When
      const { startAt, endAt } = getCalendarRange('day', BASE);

      // Then
      expect(dayjs(startAt).isSame(dayjs(BASE).startOf('day'))).toBe(true);
      expect(dayjs(endAt).diff(dayjs(startAt), 'hour')).toBe(24);
    });
  });

  describe('주 뷰 테스트', () => {
    it('기준 날짜가 속한 주의 시작부터 7일을 반환한다.', () => {
      // Given
      // When
      const { startAt, endAt } = getCalendarRange('week', BASE);

      // Then
      expect(dayjs(startAt).isSame(dayjs(BASE).startOf('week'))).toBe(true);
      expect(dayjs(endAt).diff(dayjs(startAt), 'day')).toBe(7);
    });
  });

  describe('월 뷰 테스트', () => {
    it('달 경계가 아니라 주 경계까지 넓혀서 반환한다. (월 뷰가 앞뒤 달 칸을 그린다)', () => {
      // Given
      const monthStart = dayjs(BASE).startOf('month');

      // When
      const { startAt, endAt } = getCalendarRange('month', BASE);

      // Then
      expect(dayjs(startAt).isSame(monthStart.startOf('week'))).toBe(true);
      // 시작이 주의 첫날이므로 전체 길이는 항상 7일 배수다
      expect(dayjs(endAt).diff(dayjs(startAt), 'day') % 7).toBe(0);
      // 달 전체를 포함해야 한다
      expect(dayjs(startAt).valueOf()).toBeLessThanOrEqual(monthStart.valueOf());
      expect(dayjs(endAt).valueOf()).toBeGreaterThan(dayjs(BASE).endOf('month').valueOf());
    });
  });
});

describe('shiftBaseDate 테스트', () => {
  it('뷰에 따라 이동 단위가 달라진다. (월=달, 주=주, 일=일)', () => {
    // Given
    // When
    // Then
    expect(dayjs(shiftBaseDate('month', BASE, 1)).diff(dayjs(BASE), 'month')).toBe(1);
    expect(dayjs(shiftBaseDate('week', BASE, 1)).diff(dayjs(BASE), 'day')).toBe(7);
    expect(dayjs(shiftBaseDate('day', BASE, 1)).diff(dayjs(BASE), 'day')).toBe(1);
  });

  it('방향이 -1 이면 뒤로 이동한다.', () => {
    // Given
    // When
    const prev = shiftBaseDate('month', BASE, -1);

    // Then
    expect(dayjs(prev).diff(dayjs(BASE), 'month')).toBe(-1);
  });
});
