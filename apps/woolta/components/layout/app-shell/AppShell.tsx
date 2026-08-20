'use client';

import { ReactNode } from 'react';
import { styled } from 'styled-components';
import AppRail from './AppRail';

const AppShell = ({ children }: { children: ReactNode }) => {
  return (
    <SC.Container>
      <AppRail />
      <SC.Content>{children}</SC.Content>
    </SC.Container>
  );
};

export default AppShell;

const SC = {
  Container: styled.div`
    display: flex;
    height: 100dvh;
  `,
  Content: styled.main`
    flex: 1;
    overflow-y: auto;
    background-color: ${({ theme }) => theme.colors.bgPage};
  `,
};
