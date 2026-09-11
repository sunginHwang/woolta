import { EMPTY_MEMO_CONTENT, toMemoContent } from './memoContent';

describe('toMemoContent 테스트', () => {
  it('doc 노드를 넘기면 그대로 반환한다.', () => {
    // Given
    const content = { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: '안녕' }] }] };

    // When
    const result = toMemoContent(content);

    // Then
    expect(result).toBe(content);
  });

  it('doc 이 아닌 객체를 넘기면 빈 본문으로 대체한다.', () => {
    // Given
    const content = { type: 'paragraph' };

    // When
    const result = toMemoContent(content);

    // Then
    expect(result).toEqual(EMPTY_MEMO_CONTENT);
  });

  it('null / 원시값을 넘기면 빈 본문으로 대체한다.', () => {
    // Given
    // When
    // Then
    expect(toMemoContent(null)).toEqual(EMPTY_MEMO_CONTENT);
    expect(toMemoContent(undefined)).toEqual(EMPTY_MEMO_CONTENT);
    expect(toMemoContent('doc')).toEqual(EMPTY_MEMO_CONTENT);
  });
});
