'use client';

import * as stylex from '@stylexjs/stylex';
import { TodoDetailContent, TodoDetailHeader } from '@todo/features';
import { colorVars } from '@wds/tokens.stylex';
import { Suspense } from 'react';

/**
 * Todo 앱 우측 패널 — 선택된 할 일 상세.
 * 상단 닫기 버튼으로 패널 전체를 접을 수 있다.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 right 슬롯에 배치한다.
 *
 * 헤더(닫기 버튼)는 조회에 의존하지 않으므로 경계 바깥에 둬서 로딩 중에도 닫을 수 있게 한다.
 */
export const TodoDetailScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <TodoDetailHeader />
      <div {...stylex.props(styles.content)}>
        <Suspense fallback={null}>
          <TodoDetailContent />
        </Suspense>
      </div>
    </div>
  );
};

const styles = stylex.create({
  panel: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
});
