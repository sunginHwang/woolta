import { Text } from '@wds';
import React, { FC, useCallback } from 'react';
import { ClipLoader } from 'react-spinners';
import styled, { useTheme } from 'styled-components';
import { IconBlackCircle, IconCircleCheck, IconTrashCan } from '../../../../components/atom/Icon';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';

import { Todo } from '../../detail/hooks/useBucket';

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
  const { openConfirm } = useConfirm();

  const handleToggleStateClick = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      if (isLoading || isFreeze) {
        return;
      }

      onToggleState(todo);
    },
    [todo, onToggleState, isLoading, isFreeze],
  );

  const handleRemoveClick = async () => {
    const isConfirm = await openConfirm({ message: '정말 삭제하시겠습니까?' });

    if (isConfirm) {
      onRemove(todo.id);
    }
  };

  const renderIsCompleteIcon = todo.isComplete ? (
    <IconCircleCheck fill={colors.red500} />
  ) : (
    <IconBlackCircle fill={colors.red500} />
  );

  const showRemoveBtn = !isLoading && !isFreeze;

  return (
    <S.TodoListItem data-cy='todoListItem'>
      <div>
        <i onClick={handleToggleStateClick}>
          {isLoading ? <ClipLoader color={colors.red500} size={16} /> : renderIsCompleteIcon}
        </i>
        <Text className='todo' variant='body3' color={todo.isComplete ? 'gray600' : 'gray900'} as='p'>
          {todo.title}
        </Text>
      </div>
      {showRemoveBtn && (
        <div onClick={handleRemoveClick}>
          <IconTrashCan fill={colors.gray600} />
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

    .todo {
      margin-top: 0.1rem;
      margin-left: 1rem;
    }
  `,
};
