import React, { FC, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { ClipLoader } from 'react-spinners';

import { Todo } from '../../detail/hooks/useBucket';
import { IconBlackCircle, IconCircleCheck, IconTrashCan } from 'apps/woolbank/components/atom/Icon';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  isFreeze?: boolean;
  onToggleState: (id: Todo) => void;
  onRemove: (id: number) => void;
}

/**
 * 할일 리스트 아이템 요소
 * @component
 */
export const TodoListItem: FC<Props> = ({ todo, isLoading = false, isFreeze = false, onToggleState, onRemove }) => {
  const { colors } = useTheme();

  const onToggleStateClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      if (isLoading || isFreeze) {
        return;
      }

      onToggleState(todo);
    },
    [todo, onToggleState, isLoading, isFreeze],
  );

  const onRemoveClick = useCallback(() => {
    onRemove(todo.id);
  }, [todo, onRemove]);

  const renderIsCompleteIcon = todo.isComplete ? (
    <IconCircleCheck fill={colors.red500} />
  ) : (
    <IconBlackCircle fill={colors.red500} />
  );

  const showRemoveBtn = !isLoading && !isFreeze;

  return (
    <S.TodoListItem data-cy='todoListItem'>
      <div>
        <i onClick={onToggleStateClick}>
          {isLoading ? <ClipLoader color={colors.red500} size={16} /> : renderIsCompleteIcon}
        </i>
        <S.ListTitle isComplete={todo.isComplete}>{todo.title}</S.ListTitle>
      </div>
      {showRemoveBtn && (
        <div onClick={onRemoveClick}>
          <IconTrashCan fill={colors.gray700} />
        </div>
      )}
    </S.TodoListItem>
  );
};
const S = {
  TodoListItem: styled.li`
    display: flex;
    padding: 1.5rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.8rem;
    box-shadow: rgb(220, 220, 233) 0.1rem 0.4rem 1.7rem 0.3rem;
    margin-bottom: 2rem;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    i {
      height: 2.4rem;
    }
  `,
  ListTitle: styled.div<{ isComplete: boolean }>`
    font-size: 1.4rem;
    margin-top: 0.1rem;
    line-height: 1.2rem;
    text-decoration: ${({ isComplete }) => (isComplete ? 'line-through' : 'none')};
    color: ${({ isComplete, theme }) => (isComplete ? theme.colors.gray600 : theme.colors.black)};
    font-weight: 500;
    margin-left: 1rem;
  `,
};
