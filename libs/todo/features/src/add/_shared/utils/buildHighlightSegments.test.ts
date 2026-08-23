import { buildHighlightSegments } from './buildHighlightSegments';

describe('buildHighlightSegments 테스트', () => {
  it('토큰이 없으면 전체를 일반 구간 하나로 반환한다.', () => {
    // Given
    const text = '회의 준비';

    // When
    const segments = buildHighlightSegments(text, []);

    // Then
    expect(segments).toEqual([{ startIndex: 0, text: '회의 준비', variant: null }]);
  });

  it('토큰 구간과 일반 구간을 순서대로 나눈다.', () => {
    // Given — '내일 회의' 에서 '내일' 이 날짜 토큰
    const text = '내일 회의';

    // When
    const segments = buildHighlightSegments(text, [{ startIndex: 0, endIndex: 2, variant: 'date' }]);

    // Then
    expect(segments).toEqual([
      { startIndex: 0, text: '내일', variant: 'date' },
      { startIndex: 2, text: ' 회의', variant: null },
    ]);
  });

  it('날짜와 카테고리 토큰을 시작 인덱스 순으로 함께 처리한다.', () => {
    // Given — '내일 업무 회의' 에서 '내일'(0~2), '업무'(3~5)
    const text = '내일 업무 회의';

    // When
    const segments = buildHighlightSegments(text, [
      { startIndex: 3, endIndex: 5, variant: 'category' },
      { startIndex: 0, endIndex: 2, variant: 'date' },
    ]);

    // Then
    expect(segments).toEqual([
      { startIndex: 0, text: '내일', variant: 'date' },
      { startIndex: 2, text: ' ', variant: null },
      { startIndex: 3, text: '업무', variant: 'category' },
      { startIndex: 5, text: ' 회의', variant: null },
    ]);
  });

  it('토큰이 문자열 끝에 붙어있으면 뒤쪽 일반 구간을 만들지 않는다.', () => {
    // Given
    const text = '회의 내일';

    // When
    const segments = buildHighlightSegments(text, [{ startIndex: 3, endIndex: 5, variant: 'date' }]);

    // Then
    expect(segments).toEqual([
      { startIndex: 0, text: '회의 ', variant: null },
      { startIndex: 3, text: '내일', variant: 'date' },
    ]);
  });
});
