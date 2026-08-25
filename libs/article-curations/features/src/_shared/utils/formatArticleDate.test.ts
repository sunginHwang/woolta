import { formatArticleDate } from './formatArticleDate';

describe('formatArticleDate 테스트', () => {
  it('formatArticleDate 에 ISO 문자열을 부여하면 YYYY.MM.DD 형태로 반환한다.', () => {
    // Given
    const isoDate = '2026-08-24T12:34:56.000Z';

    // When
    const result = formatArticleDate(isoDate);

    // Then
    expect(result).toBe('2026.08.24');
  });
});
