'use client';

import { type DragEvent, useState } from 'react';
import { useTodoStore } from '../../../../../_shared/stores/useTodoStore';

/**
 * 칸반 카드 드래그 앤 드롭 상태를 관리한다. (HTML5 native DnD)
 * 카드를 다른 컬럼에 드롭하면 해당 카테고리로 이동한다.
 */
export const useKanbanDrag = () => {
  const moveTodoToCategory = useTodoStore((state) => state.moveTodoToCategory);

  const [draggingTodoId, setDraggingTodoId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const handleCardDragStart = (todoId: string) => (e: DragEvent<HTMLLIElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', todoId);
    setDraggingTodoId(todoId);
  };

  const handleCardDragEnd = () => {
    setDraggingTodoId(null);
    setDragOverColumnId(null);
  };

  const handleColumnDragOver = (columnId: string | null) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumnId(columnId ?? 'inbox');
  };

  const handleColumnDragLeave = () => {
    setDragOverColumnId(null);
  };

  const handleColumnDrop = (categoryId: string | null) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const todoId = e.dataTransfer.getData('text/plain');
    if (todoId.length > 0) {
      moveTodoToCategory(todoId, categoryId);
    }
    setDraggingTodoId(null);
    setDragOverColumnId(null);
  };

  return {
    draggingTodoId,
    dragOverColumnId,
    handleCardDragStart,
    handleCardDragEnd,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleColumnDrop,
  };
};
