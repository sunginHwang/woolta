'use client';

import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import { useCategoryList } from '../../../../_shared/hooks/useCategoryList';
import { useFilteredTodoList } from '../../../../_shared/hooks/useFilteredTodoList';
import { TodoListKey } from '../../../../_shared/types';
import { INBOX_COLUMN_ID, groupTodosByCategory } from '../../../../_shared/utils/groupTodosByCategory';
import { KanbanColumn } from './components/KanbanColumn';
import { useKanbanDrag } from './hooks/useKanbanDrag';

interface Props {
  /** 표시할 리스트 키. 리스트 뷰와 동일한 범위의 할 일만 보여준다 */
  listKey: TodoListKey;
}

/**
 * 칸반 뷰. 현재 리스트 범위의 미완료 할 일을 기본함 + 카테고리별 컬럼으로 표시하고,
 * 카드를 드래그해 다른 컬럼(카테고리)으로 이동할 수 있다.
 */
export const TodoKanbanView = ({ listKey }: Props) => {
  const { overdueTodos, todos } = useFilteredTodoList(listKey);
  const categoryList = useCategoryList();
  const {
    draggingTodoId,
    dragOverColumnId,
    handleCardDragStart,
    handleCardDragEnd,
    handleColumnDragOver,
    handleColumnDragLeave,
    handleColumnDrop,
  } = useKanbanDrag();

  const todosByColumn = useMemo(() => groupTodosByCategory([...overdueTodos, ...todos]), [overdueTodos, todos]);

  const columns = [
    { categoryId: null, title: '기본함' },
    ...categoryList.map((category) => ({ categoryId: category.id, title: category.name })),
  ];

  return (
    <div {...stylex.props(styles.board)}>
      {columns.map(({ categoryId, title }) => (
        <KanbanColumn
          key={categoryId ?? INBOX_COLUMN_ID}
          listKey={listKey}
          categoryId={categoryId}
          title={title}
          todos={todosByColumn.get(categoryId ?? INBOX_COLUMN_ID) ?? []}
          isDragOver={dragOverColumnId === (categoryId ?? INBOX_COLUMN_ID)}
          draggingTodoId={draggingTodoId}
          onCardDragStart={handleCardDragStart}
          onCardDragEnd={handleCardDragEnd}
          onColumnDragOver={handleColumnDragOver(categoryId ?? INBOX_COLUMN_ID)}
          onColumnDragLeave={handleColumnDragLeave}
          onColumnDrop={handleColumnDrop(categoryId)}
        />
      ))}
    </div>
  );
};

const styles = stylex.create({
  board: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.2rem',
    flex: 1,
    minHeight: 0,
    overflowX: 'auto',
    paddingBottom: '0.8rem',
  },
});
