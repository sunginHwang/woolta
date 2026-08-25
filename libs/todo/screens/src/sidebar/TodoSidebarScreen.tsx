'use client';

import { TodoSidebar } from '@todo/features';
import { styled } from 'styled-components';

/**
 * Todo 앱 좌측 패널 — 스마트 리스트/카테고리 사이드바.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 */
export const TodoSidebarScreen = () => {
  return (
    <SC.Panel>
      <TodoSidebar />
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    height: 100%;
    padding: 1.6rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
};
