'use client';

import { DragEvent } from 'react';
import { styled } from 'styled-components';
import { DueDateLabel } from '../../_shared/components/DueDateLabel';
import { PriorityFlag } from '../../_shared/components/PriorityFlag';
import { TodoCheckbox } from '../../_shared/components/TodoCheckbox';
import { useTodoStore } from '../../_shared/stores/useTodoStore';
import { Todo } from '../../_shared/types';

interface Props {
  /** 할 일 항목 */
  todo: Todo;
  /** 드래그 중인 카드인지 여부 */
  isDragging: boolean;
  /** 드래그 시작 시 호출 */
  onCardDragStart: (e: DragEvent<HTMLLIElement>) => void;
  /** 드래그 종료 시 호출 */
  onCardDragEnd: () => void;
}

/** 칸반 컬럼 안의 할 일 카드 */
export const KanbanCard = ({ todo, isDragging, onCardDragStart, onCardDragEnd }: Props) => {
  const selectedTodoId = useTodoStore((state) => state.selectedTodoId);
  const selectTodo = useTodoStore((state) => state.selectTodo);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);

  return (
    <SC.Card
      draggable
      $isActive={todo.id === selectedTodoId}
      $isDragging={isDragging}
      onClick={() => selectTodo(todo.id)}
      onDragStart={onCardDragStart}
      onDragEnd={onCardDragEnd}
    >
      <SC.TitleRow>
        <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />
        <SC.Title>{todo.title}</SC.Title>
      </SC.TitleRow>
      {(todo.dueDate !== null || todo.priority !== 'none') && (
        <SC.MetaRow>
          {todo.dueDate !== null && <DueDateLabel dueDate={todo.dueDate} />}
          <PriorityFlag priority={todo.priority} />
        </SC.MetaRow>
      )}
    </SC.Card>
  );
};

const SC = {
  Card: styled.li<{ $isActive: boolean; $isDragging: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 1rem 1.2rem;
    border: 1px solid
      ${({ theme, $isActive }) => ($isActive ? theme.colors.interactivePrimary : theme.colors.borderSubtle)};
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    opacity: ${({ $isDragging }) => ($isDragging ? 0.4 : 1)};
    cursor: grab;

    &:hover {
      border-color: ${({ theme, $isActive }) =>
        $isActive ? theme.colors.interactivePrimary : theme.colors.borderStrong};
    }
  `,
  TitleRow: styled.div`
    display: flex;
    align-items: flex-start;
    gap: 0.8rem;
  `,
  Title: styled.span`
    flex: 1;
    min-width: 0;
    font-size: 1.3rem;
    line-height: 1.8rem;
    color: ${({ theme }) => theme.colors.textPrimary};
    word-break: break-word;
  `,
  MetaRow: styled.div`
    display: flex;
    align-items: center;
    gap: 0.8rem;
    padding-left: 2.6rem;
  `,
};
