'use client';

import { useManualSave } from '@common';
import { Text } from '@wds';
import { FiCheck, FiRotateCcw, FiTrash2, FiX } from 'react-icons/fi';
import { styled } from 'styled-components';
import { TodoCheckbox } from '../../_shared/components/TodoCheckbox';
import { useSelectedTodo } from '../../_shared/hooks/useSelectedTodo';
import { useTodoStore } from '../../_shared/stores/useTodoStore';
import { Todo } from '../../_shared/types';
import { CategorySelect } from './components/CategorySelect';
import { DueDateField } from './components/DueDateField';
import { EmptyView } from './components/EmptyView';
import { Memo } from './components/Memo';
import { PrioritySelect } from './components/PrioritySelect';
import { Title } from './components/Title';
import { useTodoAutoSave } from './hooks/useTodoAutoSave';

/** 할 일 상세 패널. 선택된 항목이 없으면 빈 상태를 표시한다. */
export const TodoDetailContent = () => {
  const selectedTodo = useSelectedTodo();

  if (selectedTodo === null) {
    return <EmptyView />;
  }

  return <Content key={selectedTodo.id} todo={selectedTodo} />;
};

interface ContentProps {
  /** 선택된 할 일 */
  todo: Todo;
}

const Content = ({ todo }: ContentProps) => {
  const updateTodo = useTodoStore((state) => state.updateTodo);
  const toggleComplete = useTodoStore((state) => state.toggleComplete);
  const moveToTrash = useTodoStore((state) => state.moveToTrash);
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteForever = useTodoStore((state) => state.deleteForever);
  const { saveTitle, saveMemo, flush } = useTodoAutoSave(todo.id);
  const { isJustSaved } = useManualSave(flush);

  const isTrashed = todo.deletedAt !== null;

  const handleDeleteForeverClick = () => {
    if (window.confirm('할 일을 영구 삭제할까요?')) {
      deleteForever(todo.id);
    }
  };

  return (
    <SC.Container>
      {isTrashed && (
        <SC.TrashBanner>
          <Text variant='small1Regular' color='textSecondary'>
            휴지통에 있는 할 일이에요
          </Text>
        </SC.TrashBanner>
      )}
      <SC.Toolbar>
        <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />
        <DueDateField dueDate={todo.dueDate} onDueDateChange={(dueDate) => updateTodo(todo.id, { dueDate })} />
        <SC.ToolbarSpacer />
        {!isTrashed && isJustSaved && (
          <SC.SavedIndicator>
            <FiCheck size={12} />
            저장됨
          </SC.SavedIndicator>
        )}
        <PrioritySelect priority={todo.priority} onPriorityChange={(priority) => updateTodo(todo.id, { priority })} />
      </SC.Toolbar>
      <Title title={todo.title} readOnly={isTrashed} isCompleted={todo.isCompleted} onTitleChange={saveTitle} />
      <Memo memo={todo.memo} readOnly={isTrashed} onMemoChange={saveMemo} />
      <SC.Footer>
        <CategorySelect
          categoryId={todo.categoryId}
          onCategoryChange={(categoryId) => updateTodo(todo.id, { categoryId })}
        />
        <SC.FooterSpacer />
        {isTrashed ? (
          <>
            <SC.FooterButton type='button' title='복원' onClick={() => restoreTodo(todo.id)}>
              <FiRotateCcw size={14} />
            </SC.FooterButton>
            <SC.FooterButton type='button' title='영구 삭제' $isDanger onClick={handleDeleteForeverClick}>
              <FiX size={15} />
            </SC.FooterButton>
          </>
        ) : (
          <SC.FooterButton type='button' title='휴지통으로 이동' $isDanger onClick={() => moveToTrash(todo.id)}>
            <FiTrash2 size={14} />
          </SC.FooterButton>
        )}
      </SC.Footer>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.6rem 2rem;
  `,
  Empty: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    height: 100%;
    color: ${({ theme }) => theme.colors.textDisabled};
  `,
  TrashBanner: styled.div`
    padding: 0.8rem 1.2rem;
    margin-bottom: 1.2rem;
    border-radius: 0.8rem;
    background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
  `,
  Toolbar: styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1.2rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderFaint};
  `,
  ToolbarSpacer: styled.div`
    flex: 1;
  `,
  SavedIndicator: styled.span`
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 1.1rem;
    line-height: 1.6rem;
    color: ${({ theme }) => theme.colors.statusSuccess};
  `,

  Footer: styled.div`
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding-top: 1.2rem;
    border-top: 1px solid ${({ theme }) => theme.colors.borderFaint};
  `,
  FooterSpacer: styled.div`
    flex: 1;
  `,
  FooterButton: styled.button<{ $isDanger?: boolean }>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border: none;
    border-radius: 0.6rem;
    background: none;
    color: ${({ theme }) => theme.colors.textTertiary};
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
      color: ${({ theme, $isDanger }) => ($isDanger ? theme.colors.statusError : theme.colors.textPrimary)};
    }
  `,
};
