'use client';

import { MemoEditor } from '@memo/features';
import { styled } from 'styled-components';

/**
 * 메모 앱 우측 패널 — 선택된 메모 에디터.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 right 슬롯에 배치한다.
 */
export const MemoEditorPanel = () => {
  return (
    <SC.Panel>
      <MemoEditor />
    </SC.Panel>
  );
};

const SC = {
  Panel: styled.div`
    height: 100%;
    background-color: ${({ theme }) => theme.colors.bgPage};
  `,
};
