'use client';

import * as stylex from '@stylexjs/stylex';
import { TodoSidebar } from '@todo/features';
import { colorVars } from '@wds/tokens.stylex';

/**
 * Todo 앱 좌측 패널 — 스마트 리스트/카테고리 사이드바.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 */
export const TodoSidebarScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <TodoSidebar />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
});
