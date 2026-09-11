'use client';

import { CalendarBoard } from '@calendar/features';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

/**
 * 캘린더 앱 화면 — 캘린더 본체 전체.
 *
 * 일정 편집·공유 오버레이가 이 패널 기준으로 떠오르도록 `position: relative` 를 가진다.
 * Suspense 경계는 기간별로 다시 걸려야 해서 CalendarBoard 안쪽에 있다.
 */
export const CalendarBoardScreen = () => {
  return (
    <div {...stylex.props(styles.panel)}>
      <CalendarBoard />
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
