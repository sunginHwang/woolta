'use client';

import { ArticleSidebar } from '@article-curations/features';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';

/**
 * 아티클 앱 좌측 패널 — 스마트 리스트/카테고리 사이드바.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 *
 * 사이드바는 카테고리·아티클·큐레이션 세 조회에 모두 의존하고(뱃지 개수) 행마다 그 값이 섞여 있어
 * 부분 경계로 쪼개기 어렵다. 페이지가 셋을 전부 프리페치하므로 실제로 fallback 이 보이는 구간은 거의 없다.
 */
export const ArticleSidebarScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <Suspense
        fallback={
          <div {...stylex.props(styles.loading)}>
            <Text as='p' variant='body3' color='textTertiary'>
              불러오는 중이에요
            </Text>
          </div>
        }
      >
        <ArticleSidebar />
      </Suspense>
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
