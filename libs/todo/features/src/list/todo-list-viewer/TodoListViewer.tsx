'use client';

import { SwitchCase } from '@croquiscom/monolith';
import { useTodoBoardView } from '../../_shared/hooks/useTodoBoardView';
import { TodoListKey } from '../../_shared/types';
import { TodoKanbanView } from './components/todo-kanban-view/TodoKanbanView';
import { TodoListView } from './components/todo-list-view/TodoListView';
import { TodoUpcomingView } from './components/todo-upcoming-view/TodoUpcomingView';
import { getViewerType } from './utils/getViewerType';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: TodoListKey;
}

/** 리스트 키와 뷰 모드에 따라 미래 / 칸반 / 리스트 뷰 중 하나를 그린다. */
export const TodoListViewer = ({ listKey }: Props) => {
  const { isUpcoming, viewMode, isViewToggleVisible } = useTodoBoardView(listKey);

  const viewerType = getViewerType({ isUpcoming, isViewToggleVisible, viewMode });

  return (
    <SwitchCase
      value={viewerType}
      cases={{
        upcoming: <TodoUpcomingView />,
        kanban: <TodoKanbanView listKey={listKey} />,
        list: <TodoListView listKey={listKey} />,
      }}
    />
  );
};
