'use client';

import { MouseEvent } from 'react';
import { FiRotateCcw, FiTrash2, FiX } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useTodoStore } from '../stores/useTodoStore';
import { Todo } from '../types';
import { DueDateLabel } from './DueDateLabel';
import { PriorityFlag } from './PriorityFlag';
import { TodoCheckbox } from './TodoCheckbox';

interface Props {
  /** 할 일 항목 */
  todo: Todo;
}

/** 리스트 뷰의 할 일 한 줄. 휴지통 항목이면 복원/영구삭제 액션을 노출한다. */
export const TodoItem = ({ todo }: Props) => {
  const selectedTodoId = useTodoStore((state) => state.selectedTodoId);
  const selectTodo = useTodoStore((state) => state.selectTodo);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const moveToTrash = useTodoStore((state) => state.moveToTrash);
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteForever = useTodoStore((state) => state.deleteForever);

  const isTrashed = todo.deletedAt !== null;

  const handleTrashClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    moveToTrash(todo.id);
  };

  const handleRestoreClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    restoreTodo(todo.id);
  };

  const handleDeleteForeverClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm('할 일을 영구 삭제할까요?')) {
      deleteForever(todo.id);
    }
  };

  return (
    <SC.Item $isActive={todo.id === selectedTodoId} onClick={() => selectTodo(todo.id)}>
      {!isTrashed && <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />}
      <SC.Title $isCompleted={todo.isCompleted}>{todo.title}</SC.Title>
      {todo.dueDate !== null && <DueDateLabel dueDate={todo.dueDate} />}
      <PriorityFlag priority={todo.priority} />
      <SC.Actions className='todo-item-actions'>
        {isTrashed ? (
          <>
            <SC.ActionButton type='button' title='복원' onClick={handleRestoreClick}>
              <FiRotateCcw size={13} />
            </SC.ActionButton>
            <SC.ActionButton type='button' title='영구 삭제' $isDanger onClick={handleDeleteForeverClick}>
              <FiX size={14} />
            </SC.ActionButton>
          </>
        ) : (
          <SC.ActionButton type='button' title='휴지통으로 이동' $isDanger onClick={handleTrashClick}>
            <FiTrash2 size={13} />
          </SC.ActionButton>
        )}
      </SC.Actions>
    </SC.Item>
  );
};

const SC = {
  Item: styled.li<{ $isActive: boolean }>`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.9rem 1.2rem;
    border-radius: 0.8rem;
    cursor: pointer;
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.colors.bgSurfaceSecondary : 'transparent')};

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};

      .todo-item-actions {
        opacity: 1;
      }
    }
  `,
  Title: styled.span<{ $isCompleted: boolean }>`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 1.4rem;
    line-height: 2rem;
    color: ${({ theme, $isCompleted }) => ($isCompleted ? theme.colors.textTertiary : theme.colors.textPrimary)};
    text-decoration: ${({ $isCompleted }) => ($isCompleted ? 'line-through' : 'none')};
  `,
  Actions: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s ease;
  `,
  ActionButton: styled.button<{ $isDanger?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.3rem;
    border: none;
    border-radius: 0.4rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      color: ${({ theme, $isDanger }) => ($isDanger ? theme.colors.statusError : theme.colors.textPrimary)};
    }
  `,
};
