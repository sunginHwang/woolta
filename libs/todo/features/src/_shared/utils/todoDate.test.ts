import { getTomorrowKey, isFuture, isOverdue, isToday } from './todoDate';

const BASE_DATE = '2026-08-22';

describe('isToday 테스트', () => {
  it('기준일 당일이면 true, 아니면 false를 반환한다.', () => {
    // Given / When / Then
    expect(isToday('2026-08-22', BASE_DATE)).toBe(true);
    expect(isToday('2026-08-21', BASE_DATE)).toBe(false);
    expect(isToday('2026-08-23', BASE_DATE)).toBe(false);
  });
});

describe('isOverdue 테스트', () => {
  it('기준일보다 이전 날짜면 true, 당일이거나 이후면 false를 반환한다.', () => {
    // Given / When / Then
    expect(isOverdue('2026-08-21', BASE_DATE)).toBe(true);
    expect(isOverdue('2026-08-22', BASE_DATE)).toBe(false);
    expect(isOverdue('2026-08-23', BASE_DATE)).toBe(false);
  });
});

describe('isFuture 테스트', () => {
  it('기준일보다 이후 날짜면 true, 당일이거나 이전이면 false를 반환한다.', () => {
    // Given / When / Then
    expect(isFuture('2026-08-23', BASE_DATE)).toBe(true);
    expect(isFuture('2026-08-22', BASE_DATE)).toBe(false);
    expect(isFuture('2026-08-21', BASE_DATE)).toBe(false);
  });
});

describe('getTomorrowKey 테스트', () => {
  it('기준일 다음 날을 반환하며 월/연 경계를 넘긴다.', () => {
    // Given / When / Then
    expect(getTomorrowKey(BASE_DATE)).toBe('2026-08-23');
    expect(getTomorrowKey('2026-08-31')).toBe('2026-09-01');
    expect(getTomorrowKey('2026-12-31')).toBe('2027-01-01');
  });
});
