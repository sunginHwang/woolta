import dayjs from 'dayjs';
import { isWithinWeek } from './isWithinWeek';

describe('isWithinWeek', () => {
  const now = dayjs('2026-11-09T15:00:00');

  it('오늘과 7일 뒤까지는 포함한다', () => {
    expect(isWithinWeek('2026-11-09T00:00:00', now)).toBe(true);
    expect(isWithinWeek('2026-11-16T23:00:00', now)).toBe(true);
  });

  it('8일 뒤부터는 제외한다', () => {
    expect(isWithinWeek('2026-11-17T00:00:00', now)).toBe(false);
  });

  it('지난 이체는 제외한다 (부호가 뒤집혔던 버그 회귀 방지)', () => {
    expect(isWithinWeek('2026-11-08T23:59:00', now)).toBe(false);
    expect(isWithinWeek('2026-11-02T00:00:00', now)).toBe(false);
  });
});
