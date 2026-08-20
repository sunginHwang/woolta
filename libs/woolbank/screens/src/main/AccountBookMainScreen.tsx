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
      <MonthStatistics />
      <SC.Line />
      <SC.Main>
        <AccountBookActiveTab />
      </SC.Main>
      <AccountBookTabs />
    </ScreenBoundary>
  );
};

const SC = {
  Main: styled.main`
    background-color: ${({ theme }) => theme.colors.white};
  `,
  Line: styled.div`
    min-height: 3rem;
  `,
};
