import type { Todo } from '../types';
import { groupTodosByCategory, INBOX_COLUMN_ID } from './groupTodosByCategory';

const baseTodo: Todo = {
  id: 'todo-1',
  title: '기본 할 일',
  memo: '',
  dueDate: null,
  categoryId: null,
  priority: 'none',
  isCompleted: false,
  completedAt: null,
  deletedAt: null,
  order: 0,
  createdAt: '2026-08-01T00:00:00.000Z',
  updatedAt: '2026-08-01T00:00:00.000Z',
};

describe('groupTodosByCategory 테스트', () => {
  it('카테고리별로 할 일을 묶어 반환한다.', () => {
    // Given
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', categoryId: 'category-1' },
      { ...baseTodo, id: 'todo-2', categoryId: 'category-2' },
      { ...baseTodo, id: 'todo-3', categoryId: 'category-1' },
    ];

    // When
    const byColumn = groupTodosByCategory(todos);

    // Then
    expect(byColumn.get('category-1')?.map((todo) => todo.id)).toEqual(['todo-1', 'todo-3']);
    expect(byColumn.get('category-2')?.map((todo) => todo.id)).toEqual(['todo-2']);
  });

  it('카테고리가 없는 할 일은 기본함 컬럼에 모은다.', () => {
    // Given
    const todos: Todo[] = [{ ...baseTodo, id: 'todo-1', categoryId: null }];

    // When
    const byColumn = groupTodosByCategory(todos);

    // Then
    expect(byColumn.get(INBOX_COLUMN_ID)?.map((todo) => todo.id)).toEqual(['todo-1']);
  });

  it('각 컬럼 안에서는 order 오름차순으로 정렬한다.', () => {
    // Given
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', order: 2 },
      { ...baseTodo, id: 'todo-2', order: 0 },
      { ...baseTodo, id: 'todo-3', order: 1 },
    ];

    // When
    const byColumn = groupTodosByCategory(todos);

    // Then
    expect(byColumn.get(INBOX_COLUMN_ID)?.map((todo) => todo.id)).toEqual(['todo-2', 'todo-3', 'todo-1']);
  });

  it('빈 목록이면 빈 맵을 반환한다.', () => {
    // Given / When
    const byColumn = groupTodosByCategory([]);

    // Then
    expect(byColumn.size).toBe(0);
  });
});
