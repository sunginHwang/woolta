'use client';

import { useTodoStore } from '../stores/useTodoStore';
import { useTodos } from './useTodos';

/** 현재 선택된 할 일을 반환한다. (없거나 서버에서 사라졌으면 null) */
export const useSelectedTodo = () => {
  const todos = useTodos();
  const selectedTodoId = useTodoStore((state) => state.selectedTodoId);

  return todos.find((todo) => todo.id === selectedTodoId) ?? null;
};
