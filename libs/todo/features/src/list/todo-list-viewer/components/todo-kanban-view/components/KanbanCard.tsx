'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { DragEvent } from 'react';
import { DueDateLabel } from '../../../../../_shared/components/DueDateLabel';
import { PriorityFlag } from '../../../../../_shared/components/PriorityFlag';
import { TodoCheckbox } from '../../../../../_shared/components/TodoCheckbox';
import { useTodoStore } from '../../../../../_shared/stores/useTodoStore';
import type { Todo } from '../../../../../_shared/types';

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
    <li
      draggable
      onClick={() => selectTodo(todo.id)}
      onDragStart={onCardDragStart}
      onDragEnd={onCardDragEnd}
      {...stylex.props(styles.card, todo.id === selectedTodoId && styles.cardActive, isDragging && styles.cardDragging)}
    >
      <div {...stylex.props(styles.titleRow)}>
        <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />
        <span {...stylex.props(styles.title)}>{todo.title}</span>
      </div>
      {(todo.dueDate !== null || todo.priority !== 'none') && (
        <div {...stylex.props(styles.metaRow)}>
          {todo.dueDate !== null && <DueDateLabel dueDate={todo.dueDate} />}
          <PriorityFlag priority={todo.priority} />
        </div>
      )}
    </li>
  );
};

const styles = stylex.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    paddingBlock: '1rem',
    paddingInline: '1.2rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':hover': colorVars['--color-borderStrong'],
    },
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    opacity: 1,
    cursor: 'grab',
  },
  cardActive: {
    borderColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimary'],
    },
  },
  cardDragging: {
    opacity: 0.4,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.8rem',
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: '1.3rem',
    lineHeight: '1.8rem',
    color: colorVars['--color-textPrimary'],
    wordBreak: 'break-word',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingLeft: '2.6rem',
  },
});
