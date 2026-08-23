import { Todo } from '../types';
import { groupTodosByDate } from './groupTodosByDate';

const BASE_DATE = '2026-08-22';

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

describe('groupTodosByDate 테스트', () => {
  it('미래 마감 할 일을 날짜별 그룹으로 묶어 날짜 오름차순으로 반환한다.', () => {
    // Given
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', dueDate: '2026-08-25' },
      { ...baseTodo, id: 'todo-2', dueDate: '2026-08-23' },
      { ...baseTodo, id: 'todo-3', dueDate: '2026-08-25' },
    ];

    // When
    const groups = groupTodosByDate(todos, BASE_DATE);

    // Then
    expect(groups).toHaveLength(2);
    expect(groups[0].date).toBe('2026-08-23');
    expect(groups[1].date).toBe('2026-08-25');
    expect(groups[1].todos.map((todo) => todo.id)).toEqual(['todo-1', 'todo-3']);
  });

  it('할 일이 없는 중간 날짜는 그룹을 만들지 않는다.', () => {
    // Given — 8/23 과 8/27 사이 날짜에는 할 일이 없다
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', dueDate: '2026-08-23' },
      { ...baseTodo, id: 'todo-2', dueDate: '2026-08-27' },
    ];

    // When
    const groups = groupTodosByDate(todos, BASE_DATE);

    // Then
    expect(groups.map((group) => group.date)).toEqual(['2026-08-23', '2026-08-27']);
  });

  it('오늘과 과거 마감 할 일은 제외한다.', () => {
    // Given
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', dueDate: '2026-08-22' },
      { ...baseTodo, id: 'todo-2', dueDate: '2026-08-20' },
      { ...baseTodo, id: 'todo-3', dueDate: '2026-08-23' },
    ];

    // When
    const groups = groupTodosByDate(todos, BASE_DATE);

    // Then
    expect(groups).toHaveLength(1);
    expect(groups[0].todos.map((todo) => todo.id)).toEqual(['todo-3']);
  });

  it('마감일이 없는 할 일은 제외한다.', () => {
    // Given
    const todos: Todo[] = [{ ...baseTodo, id: 'todo-1', dueDate: null }];

    // When
    const groups = groupTodosByDate(todos, BASE_DATE);

    // Then
    expect(groups).toHaveLength(0);
  });

  it('같은 날짜 안에서는 order 오름차순으로 정렬한다.', () => {
    // Given
    const todos: Todo[] = [
      { ...baseTodo, id: 'todo-1', dueDate: '2026-08-24', order: 2 },
      { ...baseTodo, id: 'todo-2', dueDate: '2026-08-24', order: 0 },
      { ...baseTodo, id: 'todo-3', dueDate: '2026-08-24', order: 1 },
    ];

    // When
    const groups = groupTodosByDate(todos, BASE_DATE);

    // Then
    expect(groups[0].todos.map((todo) => todo.id)).toEqual(['todo-2', 'todo-3', 'todo-1']);
  });
});
