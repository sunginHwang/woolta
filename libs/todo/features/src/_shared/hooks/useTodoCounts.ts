'use client';

import { useMemo } from 'react';
import { useTodoStore } from '../stores/useTodoStore';
import { getTodayKey, isFuture, isOverdue, isToday } from '../utils/todoDate';

/** 사이드바 뱃지에 표시할 리스트별 할 일 개수를 반환한다. */
export const useTodoCounts = () => {
  const todos = useTodoStore((state) => state.todos);

  return useMemo(() => {
    const todayKey = getTodayKey();
    const aliveTodos = todos.filter((todo) => todo.deletedAt === null);
    const activeTodos = aliveTodos.filter((todo) => !todo.isCompleted);

    const byCategory: Record<string, number> = {};
    activeTodos.forEach((todo) => {
      if (todo.categoryId !== null) {
        byCategory[todo.categoryId] = (byCategory[todo.categoryId] ?? 0) + 1;
      }
    });

    const overdue = activeTodos.filter((todo) => todo.dueDate !== null && isOverdue(todo.dueDate, todayKey)).length;
    const dueToday = activeTodos.filter((todo) => todo.dueDate !== null && isToday(todo.dueDate, todayKey)).length;

    return {
      overdue,
      /** 오늘 탭에 실제로 노출되는 개수 (지난 + 오늘) */
      today: overdue + dueToday,
      upcoming: activeTodos.filter((todo) => todo.dueDate !== null && isFuture(todo.dueDate, todayKey)).length,
      inbox: activeTodos.filter((todo) => todo.categoryId === null).length,
      completed: aliveTodos.filter((todo) => todo.isCompleted).length,
      trash: todos.filter((todo) => todo.deletedAt !== null).length,
      byCategory,
    };
  }, [todos]);
};
