import * as stylex from '@stylexjs/stylex';
import { FC, useState } from 'react';

import { TodoListItem } from '../../common/TodoListItem';
import { Todo } from '../hooks/useBucket';

interface Props {
  todoList: Todo[];
  isItemUpdateLoading: boolean;
  isFreeze: boolean;
  onRemove: (id: number) => void;
  onToggleState: (todo: Todo) => void;
}

const styles = stylex.create({
  todoList: {
    width: '100%',
    marginBottom: {
      default: null,
      ':last-child': '10rem',
    },
  },
});

/**
 * 버킷리스트 상세 - 할것 리스트
 * @component
 */

export const TodoList: FC<Props> = ({ todoList, isItemUpdateLoading, isFreeze, onRemove, onToggleState }) => {
  const [selectTodoId, setSelectedTodo] = useState(0);

  const onToggleStateClick = (todo: Todo) => {
    setSelectedTodo(todo.id);
    onToggleState(todo);
  };

  return (
    <ul {...stylex.props(styles.todoList)}>
      {todoList.map((todo, index) => {
        const isTodoLoading = isItemUpdateLoading && selectTodoId === todo.id;
        return (
          <TodoListItem
            key={index}
            todo={todo}
            isFreeze={isFreeze}
            isLoading={isTodoLoading}
            onRemove={onRemove}
            onToggleState={onToggleStateClick}
          />
        );
      })}
    </ul>
  );
};
