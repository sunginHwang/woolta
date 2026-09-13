import { formatPostDate } from './date';

describe('formatPostDate 테스트', () => {
  it('GraphQL DateTime 에서 날짜만 남긴다.', () => {
    // Given
    // When
    // Then
    expect(formatPostDate('2024-09-26T15:22:36.000Z')).toBe('2024-09-26');
  });

  it('타임존 변환을 하지 않는다. (UTC 늦은 시각이 다음 날로 밀리면 안 된다)', () => {
    // Given — KST 로 변환하면 2024-09-27 이 되는 값
    // When
    // Then
    expect(formatPostDate('2024-09-26T23:30:00.000Z')).toBe('2024-09-26');
  });

  it('이미 날짜만 있는 레거시 값은 그대로 둔다.', () => {
    // Given
    // When
    // Then
    expect(formatPostDate('2018-10-21')).toBe('2018-10-21');
  });

  it('빈 값이면 빈 문자열을 돌려준다.', () => {
    // Given
    // When
    // Then
    expect(formatPostDate('')).toBe('');
    expect(formatPostDate(null)).toBe('');
    expect(formatPostDate(undefined)).toBe('');
  });

  it('예상 밖 형식이면 원본을 그대로 보여준다. (날짜를 잃는 것보다 낫다)', () => {
    // Given
    // When
    // Then
    expect(formatPostDate('알 수 없음')).toBe('알 수 없음');
  });
});
