'use client';

import { useTodoDetailVisibility } from '@todo/features';
import { TodoDetailScreen, TodoSidebarScreen } from '@todo/screens';
import { ReactNode } from 'react';
import SplitPane from '../split-pane/SplitPane';

interface Props {
  /** 가운데 패널에 배치할 리스트 화면 */
  children: ReactNode;
}

export const TodoAppShell = ({ children }: Props) => {
  const { isDetailVisible } = useTodoDetailVisibility();

  return (
    <SplitPane
      storageKey='todo-sidebar'
      defaultLeftWidth={240}
      minLeftWidth={200}
      maxLeftWidth={360}
      left={<TodoSidebarScreen />}
      right={
        isDetailVisible ? (
          <SplitPane
            storageKey='todo-list'
            defaultLeftWidth={560}
            minLeftWidth={360}
            maxLeftWidth={880}
            left={children}
            right={<TodoDetailScreen />}
          />
        ) : (
          children
        )
      }
    />
  );
};
