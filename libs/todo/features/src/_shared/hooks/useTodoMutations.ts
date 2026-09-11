'use client';

import {
  useCompleteTodoMutation,
  useCreateTodoMutation,
  useDeleteTodoMutation,
  useEmptyTrashMutation,
  useRestoreTodoMutation,
  useTrashTodoMutation,
  useUpdateTodoMutation,
} from '../api/gql.generated';
import { useTodoStore } from '../stores/useTodoStore';
import type { Todo, TodoPriority } from '../types';
import { useTodosCache } from './useTodos';

interface AddTodoInput {
  /** 할 일 제목 */
  title: string;
  /** 마감일 (YYYY-MM-DD, 미정이면 null) */
  dueDate: string | null;
  /** 소속 카테고리 id (기본함이면 null) */
  categoryId: string | null;
  /** 우선순위 @default 'NONE' */
  priority?: TodoPriority;
}

/** 서버가 수정하는 필드만 패치로 받는다. 나머지(완료/휴지통)는 전용 뮤테이션을 쓴다. */
type UpdateTodoPatch = Partial<Pick<Todo, 'title' | 'memo' | 'dueDate' | 'categoryId' | 'priority'>>;

/** 할 일을 추가한다. */
export const useAddTodo = () => {
  const { invalidateTodos } = useTodosCache();

  const { mutate, isPending } = useCreateTodoMutation({
    onSuccess: () => invalidateTodos(),
  });

  return {
    addTodo: ({ title, dueDate, categoryId, priority = 'NONE' }: AddTodoInput) =>
      mutate({ input: { title, dueDate, categoryId, priority } }),
    isAdding: isPending,
  };
};

/** 할 일의 제목/메모/마감일/카테고리/우선순위를 수정한다. */
export const useUpdateTodo = () => {
  const { invalidateTodos } = useTodosCache();

  const { mutate, isPending } = useUpdateTodoMutation({
    onSuccess: () => invalidateTodos(),
  });

  return {
    updateTodo: (id: string, patch: UpdateTodoPatch) => mutate({ input: { id, ...patch } }),
    isUpdating: isPending,
  };
};

/** 완료 상태를 뒤집는다. 현재 상태는 호출부가 알고 있으므로 인자로 받는다. */
export const useToggleComplete = () => {
  const { invalidateTodos } = useTodosCache();

  const { mutate, isPending } = useCompleteTodoMutation({
    onSuccess: () => invalidateTodos(),
  });

  return {
    toggleComplete: (id: string, isCompleted: boolean) => mutate({ input: { id, isCompleted: !isCompleted } }),
    isToggling: isPending,
  };
};

/**
 * 휴지통 관련 동작 묶음 — 이동 / 복원 / 영구 삭제 / 비우기.
 * 넷 다 같은 목록 캐시만 건드리고 화면에서도 함께 쓰여 한 훅으로 노출한다.
 */
export const useTodoTrash = () => {
  const { invalidateTodos } = useTodosCache();

  const onSuccess = () => {
    invalidateTodos();
  };

  const trashMutation = useTrashTodoMutation({ onSuccess });
  const restoreMutation = useRestoreTodoMutation({ onSuccess });
  const emptyTrashMutation = useEmptyTrashMutation({ onSuccess });

  const deleteMutation = useDeleteTodoMutation({
    onSuccess: (_data, { input }) => {
      invalidateTodos();

      // 콜백 시점의 최신 선택을 읽어야 하므로 구독 값 대신 getState 를 쓴다.
      const { selectedTodoId, clearDetail } = useTodoStore.getState();
      if (selectedTodoId === input.id) {
        clearDetail();
      }
    },
  });

  return {
    moveToTrash: (id: string) => trashMutation.mutate({ input: { id } }),
    restoreTodo: (id: string) => restoreMutation.mutate({ input: { id } }),
    deleteForever: (id: string) => deleteMutation.mutate({ input: { id } }),
    emptyTrash: () => emptyTrashMutation.mutate({}),
  };
};
