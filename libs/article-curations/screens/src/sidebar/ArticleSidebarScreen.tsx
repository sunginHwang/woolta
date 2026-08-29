'use client';

import { ArticleSidebar } from '@article-curations/features';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

/**
 * 아티클 앱 좌측 패널 — 스마트 리스트/카테고리 사이드바.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 */
export const ArticleSidebarScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <ArticleSidebar />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    backgroundColor: colorVars['--color-bgSurface'],
  },
});
