'use client';

import { MemoList } from '@memo/features';
import { styled } from 'styled-components';

/**
 * 메모 앱 좌측 패널 — 메모 목록.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 */
export const MemoListPanel = () => {
  return (
    <SC.Panel>
      <MemoList />
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    height: 100%;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
};
