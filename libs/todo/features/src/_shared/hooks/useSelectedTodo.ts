'use client';

import { useTodoStore } from '../stores/useTodoStore';

/** 현재 선택된 할 일을 반환한다. (없으면 null) */
export const useSelectedTodo = () => {
  const todos = useTodoStore((state) => state.todos);
  const selectedTodoId = useTodoStore((state) => state.selectedTodoId);

  return todos.find((todo) => todo.id === selectedTodoId) ?? null;
};
