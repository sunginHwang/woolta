import type { Todo } from '../types';

/** 기본함 컬럼을 가리키는 키 (카테고리 id 가 null 인 경우) */
export const INBOX_COLUMN_ID = 'inbox';

/**
 * 할 일을 카테고리별로 묶어 컬럼 id → 할 일 목록 맵으로 반환한다.
 * 카테고리가 없는 항목은 기본함 컬럼(`INBOX_COLUMN_ID`)에 모으며, 각 컬럼은 order 오름차순으로 정렬한다.
 * @param todos 대상 할 일 목록
 */
export const groupTodosByCategory = (todos: Todo[]) => {
  const todosByColumn = new Map<string, Todo[]>();

  todos.forEach((todo) => {
    const columnId = todo.categoryId ?? INBOX_COLUMN_ID;
    todosByColumn.set(columnId, [...(todosByColumn.get(columnId) ?? []), todo]);
  });

  todosByColumn.forEach((columnTodos, columnId) => {
    todosByColumn.set(
      columnId,
      [...columnTodos].sort((a, b) => a.order - b.order),
    );
  });

  return todosByColumn;
};
