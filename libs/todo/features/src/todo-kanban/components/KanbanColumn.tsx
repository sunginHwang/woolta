'use client';

import { Text } from '@wds';
import { DragEvent, KeyboardEvent, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { styled } from 'styled-components';
import { useTodoStore } from '../../_shared/stores/useTodoStore';
import { Todo, TodoListKey } from '../../_shared/types';
import { getDefaultTodoDraft } from '../../_shared/utils/getDefaultTodoDraft';
import { getTodayKey } from '../../_shared/utils/todoDate';
import { KanbanCard } from './KanbanCard';

interface Props {
  /** 현재 리스트 키 (추가 시 기본 마감일 결정에 사용) */
  listKey: TodoListKey;
  /** 컬럼에 해당하는 카테고리 id (null = 기본함) */
  categoryId: string | null;
  /** 컬럼 제목 */
  title: string;
  /** 컬럼에 표시할 할 일 목록 */
  todos: Todo[];
  /** 드래그 중인 카드가 이 컬럼 위에 있는지 여부 */
  isDragOver: boolean;
  /** 드래그 중인 카드 id */
  draggingTodoId: string | null;
  /** 카드 드래그 시작 핸들러 팩토리 */
  onCardDragStart: (todoId: string) => (e: DragEvent<HTMLLIElement>) => void;
  /** 카드 드래그 종료 핸들러 */
  onCardDragEnd: () => void;
  /** 컬럼 dragover 핸들러 */
  onColumnDragOver: (e: DragEvent<HTMLDivElement>) => void;
  /** 컬럼 dragleave 핸들러 */
  onColumnDragLeave: () => void;
  /** 컬럼 drop 핸들러 */
  onColumnDrop: (e: DragEvent<HTMLDivElement>) => void;
}

/** 칸반 컬럼 (기본함 또는 카테고리 하나) */
export const KanbanColumn = ({
  listKey,
  categoryId,
  title,
  todos,
  isDragOver,
  draggingTodoId,
  onCardDragStart,
  onCardDragEnd,
  onColumnDragOver,
  onColumnDragLeave,
  onColumnDrop,
}: Props) => {
  const addTodo = useTodoStore((state) => state.addTodo);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const submitAdd = () => {
    const title = newTitle.trim();
    if (title.length > 0) {
      addTodo({ title, dueDate: getDefaultTodoDraft(listKey, getTodayKey()).dueDate, categoryId });
    }
    setNewTitle('');
    setIsAdding(false);
  };

  const handleAddInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === 'Enter') {
      submitAdd();
    }
    if (e.key === 'Escape') {
      setNewTitle('');
      setIsAdding(false);
    }
  };

  return (
    <SC.Column
      $isDragOver={isDragOver}
      onDragOver={onColumnDragOver}
      onDragLeave={onColumnDragLeave}
      onDrop={onColumnDrop}
    >
      <SC.Header>
        <Text variant='body4Bold' color='textPrimary'>
          {title}
        </Text>
        <Text variant='small1Regular' color='textTertiary'>
          {todos.length}
        </Text>
      </SC.Header>
      <SC.Cards>
        {todos.map((todo) => (
          <KanbanCard
            key={todo.id}
            todo={todo}
            isDragging={todo.id === draggingTodoId}
            onCardDragStart={onCardDragStart(todo.id)}
            onCardDragEnd={onCardDragEnd}
          />
        ))}
      </SC.Cards>
      {isAdding ? (
        <SC.AddInput
          autoFocus
          placeholder='할 일 추가'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={submitAdd}
          onKeyDown={handleAddInputKeyDown}
        />
      ) : (
        <SC.AddButton type='button' onClick={() => setIsAdding(true)}>
          <FiPlus size={13} />
          추가
        </SC.AddButton>
      )}
    </SC.Column>
  );
};

const SC = {
  Column: styled.div<{ $isDragOver: boolean }>`
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 26rem;
    max-height: 100%;
    padding: 1rem;
    border-radius: 1.2rem;
    background-color: ${({ theme, $isDragOver }) =>
      $isDragOver ? theme.colors.bgSurfaceSecondary : theme.colors.bgPage};
    border: 1px dashed ${({ theme, $isDragOver }) => ($isDragOver ? theme.colors.interactivePrimary : 'transparent')};
    transition: background-color 0.15s ease, border-color 0.15s ease;
  `,
  Header: styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0 0.4rem 0.8rem;
  `,
  Cards: styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    flex: 1;
    min-height: 4rem;
    overflow-y: auto;
    list-style: none;
    margin: 0;
    padding: 0;
  `,
  AddButton: styled.button`
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.6rem;
    padding: 0.6rem 0.8rem;
    border: none;
    border-radius: 0.8rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  `,
  AddInput: styled.input`
    margin-top: 0.6rem;
    padding: 0.6rem 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.interactivePrimary};
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1.3rem;
    outline: none;
  `,
};
