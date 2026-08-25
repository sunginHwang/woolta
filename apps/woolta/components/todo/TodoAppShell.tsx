'use client';

import { useIsomorphicLayoutEffect } from '@common';
import { useTodoDetailVisibility } from '@todo/features';
import { TodoDetailScreen, TodoSidebarScreen } from '@todo/screens';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import SplitPane from '../split-pane/SplitPane';

interface Props {
  /** 가운데 패널에 배치할 리스트 화면 */
  children: ReactNode;
}

export const TodoAppShell = ({ children }: Props) => {
  const { isDetailVisible, clearDetail } = useTodoDetailVisibility();
  const pathname = usePathname();

  // 앱 진입/사이드바 리스트 전환(경로 변경) 시 우측 상세 패널을 초기화한다.
  // 셸은 상세 토글 시 리마운트되지 않으므로 할 일 선택에는 영향을 주지 않는다.
  useIsomorphicLayoutEffect(() => {
    clearDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

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
