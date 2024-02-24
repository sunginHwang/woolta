import { memo } from 'react';
import styled from 'styled-components';
import { useBucket } from '../hooks/useBucket';
import { AddTodo } from './AddTodo';
import { Skeleton } from './Skeleton';
import { TodoList } from './TodoList';

/**
 * 버킷리스트 상세 - 할것 리스트 정보
 * @component
 */

export const TodoInfo = memo(() => {
  const { bucket, isLoading } = useBucket();
  const { addTodo, removeTodo, toggleTodoState, addLoading, updateLoading } = useBucket();

  if (bucket.id === -1) {
    return null;
  }

  const onTodoInputFocusIn = () => {
    // onToggleShowCompleteButton(false);
  };

  const onTodoInputFocusOut = () => {
    // onToggleShowCompleteButton(true);
  };

  return (
    <SC.BucketTodoInfo>
      <SC.TodoTitle>할일목록</SC.TodoTitle>
      {isLoading && <Skeleton />}
      {!isLoading && (
        <TodoList
          isItemUpdateLoading={updateLoading}
          todoList={bucket.todoList}
          isFreeze={bucket.isComplete}
          onRemove={removeTodo}
          onToggleState={toggleTodoState}
        />
      )}
      {!bucket.isComplete && (
        <AddTodo
          isLoading={addLoading}
          onAdd={addTodo}
          onTodoItemFocusIn={onTodoInputFocusIn}
          onTodoItemFocusOut={onTodoInputFocusOut}
        />
      )}
    </SC.BucketTodoInfo>
  );
});

const SC = {
  BucketTodoInfo: styled.div`
    padding: 2rem;
    background-color: ${({ theme }) => theme.colors.white};
  `,
  TodoTitle: styled.p`
    color: ${({ theme }) => theme.colors.black};
    font-weight: bold;
    font-size: 1.8rem;
    margin-bottom: 2rem;
  `,
};
