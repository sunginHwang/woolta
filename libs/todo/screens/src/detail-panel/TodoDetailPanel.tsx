'use client';

import { TodoDetailContent, TodoDetailHeader } from '@todo/features';
import { styled } from 'styled-components';

/**
 * Todo 앱 우측 패널 — 선택된 할 일 상세.
 * 상단 닫기 버튼으로 패널 전체를 접을 수 있다.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 right 슬롯에 배치한다.
 */
export const TodoDetailPanel = () => {
  return (
    <SC.Panel>
      <TodoDetailHeader />
      <SC.Content>
        <TodoDetailContent />
      </SC.Content>
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
  Content: styled.div`
    flex: 1;
    min-height: 0;
  `,
};
