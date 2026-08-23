import { TodoCategory } from '../types';
import { parseCategoryTokens } from './parseCategoryFromText';

const baseCategory: TodoCategory = {
  id: 'category-1',
  name: '업무',
  order: 0,
  createdAt: '2026-08-01T00:00:00.000Z',
};

const CATEGORIES: TodoCategory[] = [
  { ...baseCategory, id: 'category-1', name: '업무' },
  { ...baseCategory, id: 'category-2', name: '운동', order: 1 },
  { ...baseCategory, id: 'category-3', name: '업무 회의', order: 2 },
];

describe('parseCategoryTokens 테스트', () => {
  it('카테고리 이름과 일치하는 토큰을 위치와 함께 반환한다.', () => {
    // Given
    const text = '업무 보고서 쓰기';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0].categoryId).toBe('category-1');
    expect(results[0].token).toEqual({ text: '업무', startIndex: 0, endIndex: 2 });
  });

  it('# 를 붙여 입력한 경우도 인식하며 토큰에 # 를 포함한다.', () => {
    // Given
    const text = '#운동 스트레칭';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results[0].categoryId).toBe('category-2');
    expect(results[0].token).toEqual({ text: '#운동', startIndex: 0, endIndex: 3 });
  });

  it('문장 중간의 카테고리도 찾는다.', () => {
    // Given
    const text = '내일 운동 가기';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results[0].token.startIndex).toBe(3);
    expect(results[0].token.endIndex).toBe(5);
  });

  it('이름이 긴 카테고리를 먼저 매칭해 짧은 이름에 가려지지 않게 한다.', () => {
    // Given — '업무' 와 '업무 회의' 가 모두 존재한다
    const text = '업무 회의 준비';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0].categoryId).toBe('category-3');
    expect(results[0].token.text).toBe('업무 회의');
  });

  it('단어 일부로만 걸리는 경우는 매칭하지 않는다.', () => {
    // Given
    const text = '업무용 노트북 정리';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results).toHaveLength(0);
  });

  it('일치하는 카테고리가 없으면 빈 배열을 반환한다.', () => {
    // Given
    const text = '장보기';

    // When
    const results = parseCategoryTokens(text, CATEGORIES);

    // Then
    expect(results).toHaveLength(0);
  });

  it('카테고리 목록이 비어있으면 빈 배열을 반환한다.', () => {
    // Given
    const text = '업무 보고서';

    // When
    const results = parseCategoryTokens(text, []);

    // Then
    expect(results).toHaveLength(0);
  });

  it('이름에 정규식 특수문자가 있어도 문자 그대로 매칭한다.', () => {
    // Given
    const categories: TodoCategory[] = [{ ...baseCategory, id: 'category-9', name: 'C++' }];
    const text = 'C++ 공부하기';

    // When
    const results = parseCategoryTokens(text, categories);

    // Then
    expect(results).toHaveLength(1);
    expect(results[0].categoryId).toBe('category-9');
    expect(results[0].token.text).toBe('C++');
  });
});
