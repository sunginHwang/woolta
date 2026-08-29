'use client';

import { MemoList } from '@memo/features';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

/**
 * 메모 앱 좌측 패널 — 메모 목록.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 */
export const MemoListPanel = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <MemoList />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    backgroundColor: colorVars['--color-bgSurface'],
  },
});
