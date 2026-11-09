import { formatDayTitle, formatWeekLabel, toIsoDate } from './date';

describe('formatDayTitle', () => {
  it('월·일·요일을 한국어로 붙인다', () => {
    expect(formatDayTitle('2026-11-06')).toBe('11월 6일 금요일');
    expect(formatDayTitle('2026-11-01')).toBe('11월 1일 일요일');
  });

  it('잘못된 날짜면 빈 문자열', () => {
    expect(formatDayTitle('not-a-date')).toBe('');
  });
});

describe('formatWeekLabel', () => {
  it('0 기반 인덱스를 1주차부터 센다', () => {
    expect(formatWeekLabel(0)).toBe('1주차');
    expect(formatWeekLabel(4)).toBe('5주차');
  });
});

describe('toIsoDate', () => {
  it('일을 두 자리로 채운다', () => {
    expect(toIsoDate('2026-11', 6)).toBe('2026-11-06');
    expect(toIsoDate('2026-11', '14')).toBe('2026-11-14');
  });
});
