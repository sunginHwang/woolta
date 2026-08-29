'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useMemo } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { TodoItem } from '../../../../_shared/components/TodoItem';
import { TodoSection } from '../../../../_shared/components/TodoSection';
import { useFilteredTodoList } from '../../../../_shared/hooks/useFilteredTodoList';
import { getCategoryIdFromListKey } from '../../../../_shared/routes';
import { useTodoStore } from '../../../../_shared/stores/useTodoStore';
import { TodoListKey } from '../../../../_shared/types';
import { groupTodosByCategory, INBOX_COLUMN_ID } from '../../../../_shared/utils/groupTodosByCategory';

const EMPTY_MESSAGES: Record<string, string> = {
  today: '오늘 할 일이 없어요',
  inbox: '기본함이 비어있어요',
  completed: '완료한 할 일이 없어요',
  trash: '휴지통이 비어있어요',
};

interface Props {
  /** 표시할 리스트 키 */
  listKey: TodoListKey;
}

/** 할 일 리스트 뷰. 오늘 리스트는 지난 섹션을 상단에 분리하고, 카테고리별 섹션으로 묶어 표시한다. */
export const TodoListView = ({ listKey }: Props) => {
  const { overdueTodos, todos, completedTodos } = useFilteredTodoList(listKey);
  const emptyTrash = useTodoStore((state) => state.emptyTrash);
  const categories = useTodoStore((state) => state.categories);

  // 오늘 뷰는 소속 리스트(카테고리)별 섹션으로 구분한다. 기본함만 있으면 헤더 없이 flat 유지.
  const categoryColumns = useMemo(() => {
    if (listKey !== 'today') {
      return null;
    }

    const todosByColumn = groupTodosByCategory(todos);
    const columns = [
      { id: INBOX_COLUMN_ID, title: '기본함', todos: todosByColumn.get(INBOX_COLUMN_ID) ?? [] },
      ...[...categories]
        .sort((a, b) => a.order - b.order)
        .map((category) => ({ id: category.id, title: category.name, todos: todosByColumn.get(category.id) ?? [] })),
    ].filter((column) => column.todos.length > 0);

    const isOnlyInbox = columns.length === 1 && columns[0].id === INBOX_COLUMN_ID;
    return isOnlyInbox ? null : columns;
  }, [listKey, todos, categories]);

  const handleEmptyTrashClick = () => {
    if (window.confirm('휴지통을 비울까요? 모든 항목이 영구 삭제됩니다.')) {
      emptyTrash();
    }
  };

  if (overdueTodos.length === 0 && todos.length === 0 && completedTodos.length === 0) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          {EMPTY_MESSAGES[getCategoryIdFromListKey(listKey) === null ? listKey : 'inbox'] ?? '할 일이 없어요'}
        </Text>
      </div>
    );
  }

  return (
    <div {...stylex.props(styles.container)}>
      {listKey === 'trash' && (
        <div {...stylex.props(styles.trashBar)}>
          <button type='button' onClick={handleEmptyTrashClick} {...stylex.props(styles.emptyTrashButton)}>
            <FiTrash2 size={13} />
            휴지통 비우기
          </button>
        </div>
      )}
      {overdueTodos.length > 0 && (
        <TodoSection title='지난' count={overdueTodos.length} isEmphasized>
          <ul {...stylex.props(styles.items)}>
            {overdueTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </TodoSection>
      )}
      {categoryColumns ? (
        categoryColumns.map((column) => (
          <TodoSection key={column.id} title={column.title} count={column.todos.length}>
            <ul {...stylex.props(styles.items)}>
              {column.todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          </TodoSection>
        ))
      ) : overdueTodos.length > 0 ? (
        <TodoSection title='오늘' count={todos.length}>
          <ul {...stylex.props(styles.items)}>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </TodoSection>
      ) : (
        <ul {...stylex.props(styles.items)}>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
      {completedTodos.length > 0 && (
        <TodoSection title='완료' count={completedTodos.length} defaultCollapsed>
          <ul {...stylex.props(styles.items)}>
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </TodoSection>
      )}
    </div>
  );
};

const styles = stylex.create({
  container: {
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingBlock: '4rem',
    paddingInline: 0,
  },
  trashBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '0.8rem',
  },
  emptyTrashButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    paddingBlock: '0.5rem',
    paddingInline: '1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    borderRadius: '0.8rem',
    background: 'none',
    color: colorVars['--color-statusError'],
    fontSize: '1.2rem',
    cursor: 'pointer',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
});
