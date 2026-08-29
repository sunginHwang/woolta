'use client';

import * as stylex from '@stylexjs/stylex';
import { TodoItem } from '../../../../../_shared/components/TodoItem';
import { TodoSection } from '../../../../../_shared/components/TodoSection';
import type { Todo } from '../../../../../_shared/types';
import { formatDateGroupLabel } from '../../../../../_shared/utils/formatDueDate';
import { getTodayKey } from '../../../../../_shared/utils/todoDate';

interface Props {
  /** 그룹 날짜 (YYYY-MM-DD) */
  date: string;
  /** 해당 날짜의 할 일 목록 */
  todos: Todo[];
}

/** 미래 탭의 날짜 그룹 한 덩어리 */
export const DateGroup = ({ date, todos }: Props) => {
  return (
    <TodoSection title={formatDateGroupLabel(date, getTodayKey())} count={todos.length}>
      <ul {...stylex.props(styles.items)}>
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </TodoSection>
  );
};

const styles = stylex.create({
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
});
