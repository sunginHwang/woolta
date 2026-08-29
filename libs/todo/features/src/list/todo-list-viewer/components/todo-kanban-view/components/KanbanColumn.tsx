'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { DragEvent, KeyboardEvent, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useTodoStore } from '../../../../../_shared/stores/useTodoStore';
import { Todo, TodoListKey } from '../../../../../_shared/types';
import { getDefaultTodoDraft } from '../../../../../_shared/utils/getDefaultTodoDraft';
import { getTodayKey } from '../../../../../_shared/utils/todoDate';
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
    <div
      onDragOver={onColumnDragOver}
      onDragLeave={onColumnDragLeave}
      onDrop={onColumnDrop}
      {...stylex.props(styles.column, isDragOver && styles.columnDragOver)}
    >
      <div {...stylex.props(styles.header)}>
        <Text variant='body4Bold' color='textPrimary'>
          {title}
        </Text>
        <Text variant='small1Regular' color='textTertiary'>
          {todos.length}
        </Text>
      </div>
      <ul {...stylex.props(styles.cards)}>
        {todos.map((todo) => (
          <KanbanCard
            key={todo.id}
            todo={todo}
            isDragging={todo.id === draggingTodoId}
            onCardDragStart={onCardDragStart(todo.id)}
            onCardDragEnd={onCardDragEnd}
          />
        ))}
      </ul>
      {isAdding ? (
        <input
          autoFocus
          placeholder='할 일 추가'
          value={newTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
          onBlur={submitAdd}
          onKeyDown={handleAddInputKeyDown}
          {...stylex.props(styles.addInput)}
        />
      ) : (
        <button type='button' onClick={() => setIsAdding(true)} {...stylex.props(styles.addButton)}>
          <FiPlus size={13} />
          추가
        </button>
      )}
    </div>
  );
};

const styles = stylex.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    width: '26rem',
    maxHeight: '100%',
    padding: '1rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgPage'],
    borderWidth: '1px',
    borderStyle: 'dashed',
    borderColor: 'transparent',
    transitionProperty: 'background-color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
  },
  columnDragOver: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    borderColor: colorVars['--color-interactivePrimary'],
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    paddingTop: 0,
    paddingInline: '0.4rem',
    paddingBottom: '0.8rem',
  },
  cards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    flex: 1,
    minHeight: '4rem',
    overflowY: 'auto',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginTop: '0.6rem',
    paddingBlock: '0.6rem',
    paddingInline: '0.8rem',
    borderWidth: 0,
    borderRadius: '0.8rem',
    background: 'none',
    color: {
      default: colorVars['--color-textTertiary'],
      ':hover': colorVars['--color-textPrimary'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  addInput: {
    marginTop: '0.6rem',
    paddingBlock: '0.6rem',
    paddingInline: '0.8rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-interactivePrimary'],
    borderRadius: '0.8rem',
    backgroundColor: colorVars['--color-bgSurface'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.3rem',
    outline: 'none',
  },
});
