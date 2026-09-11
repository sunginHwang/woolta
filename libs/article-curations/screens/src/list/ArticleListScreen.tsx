'use client';

import { type ArticleListKey, ArticleTable } from '@article-curations/features';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';

interface Props {
  /** 라우트가 지정한 리스트 키 */
  listKey: ArticleListKey;
}

/**
 * 아티클 앱 우측 패널 — 리스트 헤더 + 아티클 테이블 + 등록 오버레이.
 * 등록 오버레이가 패널 기준으로 떠오르도록 `position: relative` 를 가진다.
 *
 * 헤더의 제목·개수도 조회 결과에서 나오므로 테이블 전체를 하나의 경계로 감싼다.
 * 페이지가 프리페치하므로 첫 렌더에서 fallback 이 보이지는 않는다.
 */
export const ArticleListScreen = ({ listKey }: Props) => {
  return (
    <div {...stylex.props(styles.panel)}>
      <Suspense
        fallback={
          <div {...stylex.props(styles.loading)}>
            <Text as='p' variant='body2' color='textTertiary'>
              아티클을 불러오는 중이에요
            </Text>
          </div>
        }
      >
        <ArticleTable listKey={listKey} />
      </Suspense>
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
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
