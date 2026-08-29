'use client';

import { ArticleTable, type ArticleListKey } from '@article-curations/features';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: ArticleListKey;
}

/**
 * 아티클 앱 우측 패널 — 리스트 헤더 + 아티클 테이블 + 등록 오버레이.
 * 등록 오버레이가 패널 기준으로 떠오르도록 `position: relative` 를 가진다.
 */
export const ArticleListScreen = ({ listKey }: Props) => {
  return (
    <div {...stylex.props(styles.panel)}>
      <ArticleTable listKey={listKey} />
    </div>
  );
};

const styles = stylex.create({
  panel: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgPage'],
  },
});
