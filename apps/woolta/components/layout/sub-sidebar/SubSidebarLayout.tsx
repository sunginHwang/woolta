'use client';

import { ReactNode } from 'react';
import { styled } from 'styled-components';
import layouts from '../../../style/layouts';

interface Props {
  /** 서브 사이드바(2depth)에 렌더할 내용 */
  sidebar: ReactNode;
  /** 콘텐츠 영역에 렌더할 내용 */
  children: ReactNode;
}

/**
 * 앱 레일(1depth) 옆에 앱 전용 서브 사이드바(2depth)를 두는 레이아웃.
 * TODO/블로그처럼 자체 내비게이션이 필요한 앱의 라우트 layout에서 사용한다.
 */
export const SubSidebarLayout = ({ sidebar, children }: Props) => {
  return (
    <SC.Container>
      <SC.Sidebar>{sidebar}</SC.Sidebar>
      <SC.Content>{children}</SC.Content>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    height: 100%;
  `,
  Sidebar: styled.aside`
    flex-shrink: 0;
    width: ${layouts.subSidebarWidth};
    height: 100%;
    overflow-y: auto;
    padding: 1.6rem 1.2rem;
    background-color: ${({ theme }) => theme.colors.bgSurface};
    border-right: 0.1rem solid ${({ theme }) => theme.colors.borderSubtle};
  `,
  Content: styled.section`
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
  `,
};
