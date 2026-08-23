import { getTodoListHref, isTodoListActive } from './routes';

describe('getTodoListHref 테스트', () => {
  it('리스트 키에 대응하는 경로를 반환한다.', () => {
    // Given / When / Then
    expect(getTodoListHref('today')).toBe('/todo');
    expect(getTodoListHref('upcoming')).toBe('/todo/upcoming');
    expect(getTodoListHref('inbox')).toBe('/todo/inbox');
    expect(getTodoListHref('category:category-1')).toBe('/todo/category/category-1');
  });
});

describe('isTodoListActive 테스트', () => {
  it('오늘은 정확 일치할 때만 활성으로 판정한다.', () => {
    // Given / When / Then
    expect(isTodoListActive('today', '/todo')).toBe(true);
    expect(isTodoListActive('today', '/todo/upcoming')).toBe(false);
  });

  it('오늘 이외 리스트는 접두 일치로 판정한다.', () => {
    // Given / When / Then
    expect(isTodoListActive('upcoming', '/todo/upcoming')).toBe(true);
    expect(isTodoListActive('upcoming', '/todo/inbox')).toBe(false);
    expect(isTodoListActive('category:category-1', '/todo/category/category-1')).toBe(true);
  });
});
