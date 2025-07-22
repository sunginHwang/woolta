import React, { FC, useRef } from 'react';
import styled from 'styled-components';

import { Todo } from '../hooks/useBucket';
import { useToggle } from '@common';
import TodoInput from '../../common/TodoInput';
import { TodoAddButton } from '../../common/TodoAddButton';

interface Props {
  onAdd: (todo: Todo) => void;
  isLoading: boolean;
  onTodoItemFocusIn?: () => void;
  onTodoItemFocusOut?: () => void;
}
/**
 * 버킷리스트 상세 - 할일 추가
 * @component
 */

export const AddTodo: FC<Props> = ({
  isLoading,
  onAdd,
  onTodoItemFocusIn = () => {},
  onTodoItemFocusOut = () => {},
}) => {
  const [showAddInput, setShowAddInputToggle] = useToggle(false);
  const onAddInput = () => setShowAddInputToggle(true);
  const offAddInput = () => setShowAddInputToggle(false);

  const addRef = useRef<HTMLDivElement>(null);

  // 할일 아이템 추가
  const onAddTodo = (title: string) => {
    onAdd({
      id: -999, // 포맷맞추기용 id
      title: title,
      isComplete: false,
    });
    offAddInput();
    // 추가 후 스크롤 최하단 이동 (입력 편리 ux)
    addRef.current && addRef.current.scrollIntoView();
  };

  return (
    <S.TodoAdd ref={addRef}>
      {showAddInput ? (
        <TodoInput
          onAdd={onAddTodo}
          onClose={offAddInput}
          onFocusIn={onTodoItemFocusIn}
          onFocusOut={onTodoItemFocusOut}
        />
      ) : (
        <TodoAddButton isLoading={isLoading} onClick={onAddInput} />
      )}
    </S.TodoAdd>
  );
};

const S = {
  TodoAdd: styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20rem;
  `,
};
