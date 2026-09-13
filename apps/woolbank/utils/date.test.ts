import { getRemainDays, toKstDateString } from './date';

describe('toKstDateString 테스트', () => {
  it('UTC 시각을 KST 날짜로 바꾼다.', () => {
    // Given — UTC 2026-09-12 20:00 은 KST 로 2026-09-13 05:00
    // When
    // Then
    expect(toKstDateString('2026-09-12T20:00:00.000Z')).toBe('2026-09-13');
  });

  it('호스트 타임존과 무관하게 같은 값을 낸다. (하이드레이션 불일치의 원인)', () => {
    // Given
    const instant = '2026-09-12T20:00:00.000Z';
    const original = process.env.TZ;

    // When — 서버가 UTC, 브라우저가 KST 인 상황을 흉내낸다
    process.env.TZ = 'UTC';
    const asUtcHost = toKstDateString(instant);
    process.env.TZ = 'Asia/Seoul';
    const asKstHost = toKstDateString(instant);
    process.env.TZ = original;

    // Then
    expect(asUtcHost).toBe(asKstHost);
  });

  it('KST 자정 직전은 아직 전날이다.', () => {
    // Given — UTC 14:59 = KST 23:59
    // When
    // Then
    expect(toKstDateString('2026-09-12T14:59:00.000Z')).toBe('2026-09-12');
  });
});

describe('getRemainDays + KST 날짜 조합 테스트', () => {
  it('날짜만으로 남은 일수를 센다.', () => {
    // Given
    const today = toKstDateString('2026-09-13T01:00:00.000Z');
    const target = toKstDateString('2026-09-20T09:00:00.000Z');

    // When
    // Then
    expect(getRemainDays(today, target)).toBe(7);
  });

  it('지난 날짜는 0 이다.', () => {
    // Given
    const today = toKstDateString('2026-09-13T01:00:00.000Z');
    const target = toKstDateString('2026-09-01T09:00:00.000Z');

    // When
    // Then
    expect(getRemainDays(today, target)).toBe(0);
  });
});
