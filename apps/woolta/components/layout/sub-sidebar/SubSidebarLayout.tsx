'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { ReactNode } from 'react';
import { layoutConsts } from '../../../style/layouts.stylex';

interface Props {
  /** 서브 사이드바(2depth)에 렌더할 내용 */
  sidebar: ReactNode;
  /** 콘텐츠 영역에 렌더할 내용 */
  children: ReactNode;
}

const styles = stylex.create({
  container: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    flexShrink: 0,
    width: layoutConsts.subSidebarWidth,
    height: '100%',
    overflowY: 'auto',
    paddingBlock: '1.6rem',
    paddingInline: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderRightWidth: '0.1rem',
    borderRightStyle: 'solid',
    borderRightColor: colorVars['--color-borderSubtle'],
  },
  content: {
    flex: 1,
    minWidth: 0,
    height: '100%',
    overflowY: 'auto',
  },
});

/**
 * 앱 레일(1depth) 옆에 앱 전용 서브 사이드바(2depth)를 두는 레이아웃.
 * TODO/블로그처럼 자체 내비게이션이 필요한 앱의 라우트 layout에서 사용한다.
 */
export const SubSidebarLayout = ({ sidebar, children }: Props) => {
  return (
    <div {...stylex.props(styles.container)}>
      <aside {...stylex.props(styles.sidebar)}>{sidebar}</aside>
      <section {...stylex.props(styles.content)}>{children}</section>
    </div>
  );
};
