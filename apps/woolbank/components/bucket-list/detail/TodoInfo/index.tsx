import { Text } from '@wds';
import { useSetAtom } from 'jotai';
import { memo } from 'react';
import styled from 'styled-components';
import { useBucket } from '../hooks/useBucket';
import { isShowCompleteButtonAtom } from '../store';
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
  const setIsShowCompleteButtonAtom = useSetAtom(isShowCompleteButtonAtom);
  if (bucket.id === -1) {
    return null;
  }

  const onTodoInputFocusIn = () => {
    setIsShowCompleteButtonAtom(false);
  };

  const onTodoInputFocusOut = () => {
    setIsShowCompleteButtonAtom(true);
  };

  return (
    <SC.BucketTodoInfo>
      <Text className='title' variant='title2Bold' color='gray800' as='h3'>
        할일목록
      </Text>
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

    .title {
      margin-bottom: 2rem;
    }
  `,
};
