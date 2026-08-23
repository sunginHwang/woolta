import { getDefaultTodoDraft } from './getDefaultTodoDraft';

const TODAY_KEY = '2026-08-22';

describe('getDefaultTodoDraft 테스트', () => {
  it('오늘 리스트는 오늘을 기본 마감일로 반환한다.', () => {
    // Given / When
    const draft = getDefaultTodoDraft('today', TODAY_KEY);

    // Then
    expect(draft).toEqual({ dueDate: '2026-08-22', categoryId: null });
  });

  it('미래 리스트는 내일을 기본 마감일로 반환한다.', () => {
    // Given / When
    const draft = getDefaultTodoDraft('upcoming', TODAY_KEY);

    // Then
    expect(draft).toEqual({ dueDate: '2026-08-23', categoryId: null });
  });

  it('기본함 리스트는 마감일과 카테고리를 모두 비워 반환한다.', () => {
    // Given / When
    const draft = getDefaultTodoDraft('inbox', TODAY_KEY);

    // Then
    expect(draft).toEqual({ dueDate: null, categoryId: null });
  });

  it('카테고리 리스트는 해당 카테고리를 기본값으로 반환한다.', () => {
    // Given / When
    const draft = getDefaultTodoDraft('category:category-1', TODAY_KEY);

    // Then
    expect(draft).toEqual({ dueDate: null, categoryId: 'category-1' });
  });
});
