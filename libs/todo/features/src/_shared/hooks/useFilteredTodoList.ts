'use client';

import { useMemo } from 'react';
import { getCategoryIdFromListKey } from '../routes';
import { useTodoStore } from '../stores/useTodoStore';
import { Todo, TodoListKey } from '../types';
import { getTodayKey, isOverdue, isToday } from '../utils/todoDate';

/** 리스트 키에 해당하는 활성(미완료) 필터 조건을 반환한다. */
const getActiveFilter = (listKey: TodoListKey, todayKey: string) => {
  const categoryId = getCategoryIdFromListKey(listKey);

  if (categoryId !== null) {
    return (todo: Todo) => todo.categoryId === categoryId;
  }
  if (listKey === 'today') {
    return (todo: Todo) => todo.dueDate !== null && isToday(todo.dueDate, todayKey);
  }
  if (listKey === 'inbox') {
    return (todo: Todo) => todo.categoryId === null;
  }
  return () => true;
};

/**
 * 선택된 리스트 키에 해당하는 할 일 목록을 반환한다.
 * - overdueTodos: 오늘 리스트에서만 채워지는 지난(마감일 초과) 미완료 항목 (마감일 오름차순)
 * - todos: 리스트 범위의 미완료 항목 (order 오름차순)
 * - completedTodos: 리스트 범위의 완료 항목 (completedAt 내림차순, 완료/휴지통 리스트에서는 빈 배열)
 */
export const useFilteredTodoList = (listKey: TodoListKey) => {
  const allTodos = useTodoStore((state) => state.todos);

  return useMemo(() => {
    if (listKey === 'trash') {
      const trashed = allTodos.filter((todo) => todo.deletedAt !== null);
      return {
        overdueTodos: [] as Todo[],
        todos: [...trashed].sort((a, b) => (b.deletedAt ?? '').localeCompare(a.deletedAt ?? '')),
        completedTodos: [] as Todo[],
      };
    }

    const aliveTodos = allTodos.filter((todo) => todo.deletedAt === null);

    if (listKey === 'completed') {
      const completed = aliveTodos.filter((todo) => todo.isCompleted);
      return {
        overdueTodos: [] as Todo[],
        todos: [...completed].sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
        completedTodos: [] as Todo[],
      };
    }

    const todayKey = getTodayKey();
    const isInScope = getActiveFilter(listKey, todayKey);
    const scoped = aliveTodos.filter(isInScope);

    const overdueTodos =
      listKey === 'today'
        ? aliveTodos
            .filter((todo) => !todo.isCompleted && todo.dueDate !== null && isOverdue(todo.dueDate, todayKey))
            .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''))
        : [];

    return {
      overdueTodos,
      todos: scoped.filter((todo) => !todo.isCompleted).sort((a, b) => a.order - b.order),
      completedTodos: scoped
        .filter((todo) => todo.isCompleted)
        .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? '')),
    };
  }, [allTodos, listKey]);
};
