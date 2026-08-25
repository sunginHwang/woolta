'use client';

import { Text } from '@wds';
import { useMemo } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { styled } from 'styled-components';
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
      <SC.Empty>
        <Text as='p' variant='body3' color='textTertiary' alignment='center'>
          {EMPTY_MESSAGES[getCategoryIdFromListKey(listKey) === null ? listKey : 'inbox'] ?? '할 일이 없어요'}
        </Text>
      </SC.Empty>
    );
  }

  return (
    <SC.Container>
      {listKey === 'trash' && (
        <SC.TrashBar>
          <SC.EmptyTrashButton type='button' onClick={handleEmptyTrashClick}>
            <FiTrash2 size={13} />
            휴지통 비우기
          </SC.EmptyTrashButton>
        </SC.TrashBar>
      )}
      {overdueTodos.length > 0 && (
        <TodoSection title='지난' count={overdueTodos.length} isEmphasized>
          <SC.Items>
            {overdueTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </SC.Items>
        </TodoSection>
      )}
      {categoryColumns ? (
        categoryColumns.map((column) => (
          <TodoSection key={column.id} title={column.title} count={column.todos.length}>
            <SC.Items>
              {column.todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </SC.Items>
          </TodoSection>
        ))
      ) : overdueTodos.length > 0 ? (
        <TodoSection title='오늘' count={todos.length}>
          <SC.Items>
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </SC.Items>
        </TodoSection>
      ) : (
        <SC.Items>
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </SC.Items>
      )}
      {completedTodos.length > 0 && (
        <TodoSection title='완료' count={completedTodos.length} defaultCollapsed>
          <SC.Items>
            {completedTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </SC.Items>
        </TodoSection>
      )}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  `,
  Items: styled.ul`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    list-style: none;
    margin: 0;
    padding: 0;
  `,
  Empty: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: 4rem 0;
  `,
  TrashBar: styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 0.8rem;
  `,
  EmptyTrashButton: styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1rem;
    border: 1px solid ${({ theme }) => theme.colors.borderSubtle};
    border-radius: 0.8rem;
    background: none;
    color: ${({ theme }) => theme.colors.statusError};
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.bgSurfaceSecondary};
    }
  `,
};
