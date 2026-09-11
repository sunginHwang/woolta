'use client';

import * as stylex from '@stylexjs/stylex';
import { TodoSidebar } from '@todo/features';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';

/**
 * Todo 앱 좌측 패널 — 스마트 리스트/카테고리 사이드바.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 left 슬롯에 배치한다.
 *
 * 행마다 뱃지 개수가 섞여 있어 부분 경계로 쪼개기 어렵다.
 * 레이아웃이 할 일·카테고리를 모두 프리페치하므로 fallback 이 보이는 구간은 거의 없다.
 */
export const TodoSidebarScreen = () => {
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
        <TodoSidebar />
      </Suspense>
    </div>
  );
};

const styles = stylex.create({
  panel: {
    height: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
