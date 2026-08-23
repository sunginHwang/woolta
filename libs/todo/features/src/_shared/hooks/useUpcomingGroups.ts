'use client';

import { useMemo } from 'react';
import { useTodoStore } from '../stores/useTodoStore';
import { groupTodosByDate } from '../utils/groupTodosByDate';
import { getTodayKey } from '../utils/todoDate';

/** 미래(내일 이후) 마감 할 일을 날짜별 그룹으로 반환한다. */
export const useUpcomingGroups = () => {
  const todos = useTodoStore((state) => state.todos);

  return useMemo(() => {
    const activeTodos = todos.filter((todo) => todo.deletedAt === null && !todo.isCompleted);
    return groupTodosByDate(activeTodos, getTodayKey());
  }, [todos]);
};
