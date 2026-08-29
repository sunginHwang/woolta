'use client';

import { MemoEditor } from '@memo/features';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

/**
 * 메모 앱 우측 패널 — 선택된 메모 에디터.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 right 슬롯에 배치한다.
 */
export const MemoEditorPanel = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <MemoEditor />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    backgroundColor: colorVars['--color-bgPage'],
  },
});
