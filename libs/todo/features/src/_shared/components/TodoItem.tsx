'use client';

import * as stylex from '@stylexjs/stylex';
import { useConfirm } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { MouseEvent } from 'react';
import { FiRotateCcw, FiTrash2, FiX } from 'react-icons/fi';
import { useTodoStore } from '../stores/useTodoStore';
import type { Todo } from '../types';
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
  const { openConfirm } = useConfirm();
  const restoreTodo = useTodoStore((state) => state.restoreTodo);
  const deleteForever = useTodoStore((state) => state.deleteForever);

  const isTrashed = todo.deletedAt !== null;

  const handleTrashClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const isConfirm = await openConfirm({ message: `'${todo.title}' 할 일을 삭제할까요?` });
    if (isConfirm) {
      moveToTrash(todo.id);
    }
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
    <li
      onClick={() => selectTodo(todo.id)}
      {...stylex.props(styles.item, todo.id === selectedTodoId && styles.itemActive)}
    >
      {!isTrashed && <TodoCheckbox isCompleted={todo.isCompleted} onCheckClick={() => toggleComplete(todo.id)} />}
      <span {...stylex.props(styles.title, todo.isCompleted && styles.titleCompleted)}>{todo.title}</span>
      {todo.dueDate !== null && <DueDateLabel dueDate={todo.dueDate} />}
      <PriorityFlag priority={todo.priority} />
      <span {...stylex.props(styles.actions)}>
        {isTrashed ? (
          <>
            <button type='button' title='복원' onClick={handleRestoreClick} {...stylex.props(styles.actionButton)}>
              <FiRotateCcw size={13} />
            </button>
            <button
              type='button'
              title='영구 삭제'
              onClick={handleDeleteForeverClick}
              {...stylex.props(styles.actionButton, styles.actionButtonDanger)}
            >
              <FiX size={14} />
            </button>
          </>
        ) : (
          <button
            type='button'
            title='휴지통으로 이동'
            onClick={handleTrashClick}
            {...stylex.props(styles.actionButton, styles.actionButtonDanger)}
          >
            <FiTrash2 size={13} />
          </button>
        )}
      </span>
    </li>
  );
};

const styles = stylex.create({
  item: {
    // 항목 hover 시 액션 노출 — 자손 선택자 대신 상속되는 CSS 변수 토글
    '--todo-actions-opacity': {
      default: '0',
      ':hover': '1',
    },
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    paddingBlock: '0.9rem',
    paddingInline: '1.2rem',
    borderRadius: '0.8rem',
    cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  itemActive: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  title: {
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    fontSize: '1.4rem',
    lineHeight: '2rem',
    color: colorVars['--color-textPrimary'],
    textDecoration: 'none',
  },
  titleCompleted: {
    color: colorVars['--color-textTertiary'],
    textDecoration: 'line-through',
  },
  actions: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexShrink: 0,
    opacity: 'var(--todo-actions-opacity)' as unknown as number,
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
  actionButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.3rem',
    borderWidth: 0,
    borderRadius: '0.4rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    cursor: 'pointer',
  },
  actionButtonDanger: {
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-statusError'],
    },
  },
});
