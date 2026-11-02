import dayjs from 'dayjs';
import { formatNotificationTime } from './formatNotificationTime';

describe('formatNotificationTime', () => {
  const now = dayjs('2026-11-03T12:00:00');

  it('같은 날이면 시각만 보여준다', () => {
    expect(formatNotificationTime(dayjs('2026-11-03T08:05:00').toISOString(), now)).toBe('08:05');
  });

  it('다른 날이면 월일과 시각을 보여준다', () => {
    expect(formatNotificationTime(dayjs('2026-11-02T21:00:00').toISOString(), now)).toBe('11월 2일 21:00');
  });

  it('잘못된 값은 빈 문자열이다', () => {
    expect(formatNotificationTime('not-a-date', now)).toBe('');
  });
});
