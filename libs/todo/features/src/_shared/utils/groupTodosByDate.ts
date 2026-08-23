import { Todo } from '../types';
import { isFuture } from './todoDate';

export interface TodoDateGroup {
  /** 그룹 날짜 (YYYY-MM-DD) */
  date: string;
  /** 해당 날짜의 할 일 목록 (order 오름차순) */
  todos: Todo[];
}

/**
 * 미래 마감 할 일을 마감일별 그룹으로 묶어 날짜 오름차순으로 반환한다.
 * 마감일이 없거나 기준일 이전/당일인 항목은 제외하며, 할 일이 없는 날짜는 그룹을 만들지 않는다.
 * @param todos 대상 할 일 목록
 * @param baseDate 기준일 (YYYY-MM-DD)
 */
export const groupTodosByDate = (todos: Todo[], baseDate: string): TodoDateGroup[] => {
  const futureTodos = todos.filter((todo) => todo.dueDate !== null && isFuture(todo.dueDate, baseDate));

  const todosByDate = new Map<string, Todo[]>();
  futureTodos.forEach((todo) => {
    const date = todo.dueDate as string;
    todosByDate.set(date, [...(todosByDate.get(date) ?? []), todo]);
  });

  return [...todosByDate.entries()]
    .map(([date, dateTodos]) => ({ date, todos: [...dateTodos].sort((a, b) => a.order - b.order) }))
    .sort((a, b) => a.date.localeCompare(b.date));
};
