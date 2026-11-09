import { addDays, findWeekIndex, formatDateLabel, getWeekRows, isSameMonth } from './weekRows';

describe('getWeekRows', () => {
  it('2026년 11월(일요일 시작)은 1일이 일요일이라 5행이고 앞 달 날짜가 없다', () => {
    const rows = getWeekRows('2026-11', 0);

    expect(rows).toHaveLength(5);
    expect(rows[0].dates[0]).toBe('2026-11-01');
    expect(rows[4].dates[6]).toBe('2026-12-05');
  });

  it('2026년 11월을 월요일 시작으로 자르면 첫 행에 10월 26일이 들어온다', () => {
    const rows = getWeekRows('2026-11', 1);

    expect(rows[0].dates[0]).toBe('2026-10-26');
    expect(rows[0].dates[6]).toBe('2026-11-01');
    expect(rows.at(-1)?.dates).toContain('2026-11-30');
  });

  it('2026년 2월(일요일 시작, 1일이 일요일, 28일)은 정확히 4행', () => {
    const rows = getWeekRows('2026-02', 0);

    expect(rows).toHaveLength(4);
    expect(rows[3].dates[6]).toBe('2026-02-28');
  });

  it('2026년 8월(일요일 시작, 1일이 토요일, 31일)은 6행', () => {
    const rows = getWeekRows('2026-08', 0);

    expect(rows).toHaveLength(6);
    expect(rows[0].dates[0]).toBe('2026-07-26');
    expect(rows[5].dates[0]).toBe('2026-08-30');
  });

  it('모든 행은 7일이고 인덱스가 순서대로다', () => {
    const rows = getWeekRows('2026-11', 0);

    rows.forEach((row, i) => {
      expect(row.index).toBe(i);
      expect(row.dates).toHaveLength(7);
    });
  });
});

describe('findWeekIndex', () => {
  const rows = getWeekRows('2026-11', 0);

  it('날짜가 속한 행을 찾는다', () => {
    expect(findWeekIndex(rows, '2026-11-06')).toBe(0);
    expect(findWeekIndex(rows, '2026-11-30')).toBe(4);
  });

  it('없는 날짜·undefined 는 -1', () => {
    expect(findWeekIndex(rows, '2026-12-25')).toBe(-1);
    expect(findWeekIndex(rows, undefined)).toBe(-1);
  });
});

describe('addDays / isSameMonth / formatDateLabel', () => {
  it('달과 해를 넘겨 더한다', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('같은 달인지 문자열로 판단한다', () => {
    expect(isSameMonth('2026-11-06', '2026-11')).toBe(true);
    expect(isSameMonth('2026-12-01', '2026-11')).toBe(false);
  });

  it('aria 라벨은 앞자리 0 없이', () => {
    expect(formatDateLabel('2026-11-06')).toBe('11월 6일');
  });
});
