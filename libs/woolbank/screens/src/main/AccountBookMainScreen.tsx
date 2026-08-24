'use client';

import { AccountBookActiveTab, AccountBookTabs, MonthStatistics } from '@woolta/woolbank-features';
import styled from 'styled-components';
import { ScreenBoundary } from '../common/ScreenBoundary';

/**
 * 가계부 메인 스크린 (리스트 + 캘린더 탭)
 */
export const AccountBookMainScreen = () => {
  return (
    <ScreenBoundary>
      <SC.Container>
        <MonthStatistics />
        <SC.Line />
        <SC.Main>
          <AccountBookActiveTab />
        </SC.Main>
        <AccountBookTabs />
      </SC.Container>
    </ScreenBoundary>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 72rem;
    min-height: 100%;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
  Main: styled.main`
    flex: 1;
    background-color: ${({ theme }) => theme.colors.bgSurface};
  `,
  Line: styled.div`
    min-height: 3rem;
  `,
};
