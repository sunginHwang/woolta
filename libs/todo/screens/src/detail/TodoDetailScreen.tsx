'use client';

import * as stylex from '@stylexjs/stylex';
import { TodoDetailContent, TodoDetailHeader } from '@todo/features';
import { colorVars } from '@wds/tokens.stylex';

/**
 * Todo 앱 우측 패널 — 선택된 할 일 상세.
 * 상단 닫기 버튼으로 패널 전체를 접을 수 있다.
 * 호스트 앱이 SplitPane 등 분할 레이아웃의 right 슬롯에 배치한다.
 */
export const TodoDetailScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <TodoDetailHeader />
      <div {...stylex.props(styles.content)}>
        <TodoDetailContent />
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
