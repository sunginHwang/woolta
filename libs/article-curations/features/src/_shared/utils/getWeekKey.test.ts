import { getWeekKey } from './getWeekKey';

describe('getWeekKey 테스트', () => {
  it('getWeekKey 에 연중 평일 날짜를 부여하면 해당 ISO 주차 키를 반환한다.', () => {
    // Given
    const date = new Date(2026, 7, 24); // 2026-08-24 (월)

    // When
    const result = getWeekKey(date);

    // Then
    expect(result).toBe('2026-W35');
  });

  it('getWeekKey 에 같은 주의 다른 요일을 부여하면 동일한 주차 키를 반환한다.', () => {
    // Given
    const monday = new Date(2026, 7, 24); // 2026-08-24 (월)
    const sunday = new Date(2026, 7, 30); // 2026-08-30 (일)

    // When
    const mondayResult = getWeekKey(monday);
    const sundayResult = getWeekKey(sunday);

    // Then
    expect(mondayResult).toBe(sundayResult);
  });

  it('getWeekKey 에 다음 해 주차에 속한 연말 날짜를 부여하면 다음 해 1주차를 반환한다.', () => {
    // Given
    const date = new Date(2025, 11, 29); // 2025-12-29 (월) — ISO 기준 2026년 1주차

    // When
    const result = getWeekKey(date);

    // Then
    expect(result).toBe('2026-W01');
  });

  it('getWeekKey 에 이전 해 주차에 속한 연초 날짜를 부여하면 이전 해 마지막 주차를 반환한다.', () => {
    // Given
    const date = new Date(2027, 0, 1); // 2027-01-01 (금) — ISO 기준 2026년 53주차

    // When
    const result = getWeekKey(date);

    // Then
    expect(result).toBe('2026-W53');
  });
});
