import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import type React from 'react';
import { type FC, useCallback } from 'react';
import { ClipLoader } from 'react-spinners';
import { IconBlackCircle, IconCircleCheck, IconTrashCan } from '../../../../components/atom/Icon';
import { useConfirm } from '../../../../components/Confirm/ConfirmContext';

import type { Todo } from '../../detail/hooks/useBucket';

interface Props {
  todo: Todo;
  isLoading?: boolean;
  isFreeze?: boolean;
  onToggleState: (id: Todo) => void;
  onRemove: (id: number) => void;
}

const styles = stylex.create({
  listItem: {
    display: 'flex',
    paddingBlock: '1.5rem',
    paddingInline: '1.5rem',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '0.8rem',
    boxShadow: 'rgb(220, 220, 233) 0.1rem 0.4rem 1.7rem 0.3rem',
    marginBottom: '2rem',
  },
  innerDiv: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSlot: {
    height: '2.4rem',
  },
  todoText: {
    marginTop: '0.1rem',
    marginLeft: '1rem',
  },
});

/**
 * 할일 리스트 아이템 요소
 * @component
 */
export const TodoListItem: FC<Props> = ({ todo, isLoading = false, isFreeze = false, onToggleState, onRemove }) => {
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
    <IconCircleCheck fill='#f03e3e' />
  ) : (
    <IconBlackCircle fill='#f03e3e' />
  );

  const showRemoveBtn = !isLoading && !isFreeze;

  return (
    <li {...stylex.props(styles.listItem)} data-cy='todoListItem'>
      <div {...stylex.props(styles.innerDiv)}>
        <i {...stylex.props(styles.iconSlot)} onClick={handleToggleStateClick}>
          {isLoading ? <ClipLoader color='#f03e3e' size={16} /> : renderIsCompleteIcon}
        </i>
        <Text xstyle={styles.todoText} variant='body3' color={todo.isComplete ? 'gray600' : 'gray900'} as='p'>
          {todo.title}
        </Text>
      </div>
      {showRemoveBtn && (
        <div {...stylex.props(styles.innerDiv)} onClick={handleRemoveClick}>
          <IconTrashCan fill='#919191' />
        </div>
      )}
    </li>
  );
};
