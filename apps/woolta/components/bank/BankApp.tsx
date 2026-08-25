'use client';

import { useIsomorphicLayoutEffect } from '@common';
import { selectedAccountBookIdAtom } from '@woolta/woolbank-features';
import { AccountBookDetailPanel, AccountBookMainScreen } from '@woolta/woolbank-screens';
import { useSetAtom } from 'jotai';
import SplitPane from '../split-pane/SplitPane';

/**
 * 가계부 앱 셸 — 좌측 리스트/캘린더, 우측 선택 내역 상세 패널.
 * 앱 진입 시 이전 선택을 초기화해 우측 패널이 빈 상태로 시작한다.
 */
export const BankApp = () => {
  const setSelectedAccountBookId = useSetAtom(selectedAccountBookIdAtom);

  useIsomorphicLayoutEffect(() => {
    setSelectedAccountBookId(null);
  }, [setSelectedAccountBookId]);

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
