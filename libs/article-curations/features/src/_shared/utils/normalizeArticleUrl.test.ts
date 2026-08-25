import { normalizeArticleUrl } from './normalizeArticleUrl';

describe('normalizeArticleUrl 테스트', () => {
  it('normalizeArticleUrl 에 https URL 을 부여하면 그대로 반환한다.', () => {
    // Given
    const rawUrl = 'https://example.com/article';

    // When
    const result = normalizeArticleUrl(rawUrl);

    // Then
    expect(result).toBe('https://example.com/article');
  });

  it('normalizeArticleUrl 에 스킴 없는 URL 을 부여하면 https 를 붙여 반환한다.', () => {
    // Given
    const rawUrl = 'example.com/article';

    // When
    const result = normalizeArticleUrl(rawUrl);

    // Then
    expect(result).toBe('https://example.com/article');
  });

  it('normalizeArticleUrl 에 빈 문자열을 부여하면 null 을 반환한다.', () => {
    // Given
    const rawUrl = '   ';

    // When
    const result = normalizeArticleUrl(rawUrl);

    // Then
    expect(result).toBeNull();
  });
});
