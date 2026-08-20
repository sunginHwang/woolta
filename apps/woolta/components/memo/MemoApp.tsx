'use client';

import { MemoEditorPanel, MemoListPanel } from '@memo/screens';
import SplitPane from '../split-pane/SplitPane';

export const MemoApp = () => {
  return (
    <SplitPane
      storageKey='memo'
      defaultLeftWidth={280}
      minLeftWidth={220}
      maxLeftWidth={480}
      left={<MemoListPanel />}
      right={<MemoEditorPanel />}
    />
  );
};
