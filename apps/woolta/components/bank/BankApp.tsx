'use client';

import { AccountBookDetailPanel, AccountBookMainScreen } from '@woolta/woolbank-screens';
import SplitPane from '../split-pane/SplitPane';

/**
 * 가계부 앱 셸 — 좌측 리스트/캘린더, 우측 선택 내역 상세 패널.
 */
export const BankApp = () => {
  return (
    <SplitPane
      storageKey='bank'
      defaultLeftWidth={560}
      minLeftWidth={400}
      maxLeftWidth={760}
      left={<AccountBookMainScreen />}
      right={<AccountBookDetailPanel />}
    />
  );
};
