'use client';

import { OverlayPortalProvider } from '@common';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';

interface Props {
  /** 패널 오버레이 포털 대상 요소 id (패널별 고유 값, 예: 'bank-detail-overlay') */
  targetId: string;
  children: ReactNode;
}

const styles = stylex.create({
  boundary: {
    position: 'relative',
    height: '100%',
    overflow: 'hidden',
    transform: 'translateZ(0)',
  },
  scroll: {
    height: '100%',
    overflowY: 'auto',
  },
});

/**
 * 딤/바텀싯 등 오버레이를 패널 영역 안으로 가두는 호스트.
 * Boundary의 transform이 fixed 자손의 containing block이 되어,
 * 전역 기준(position: fixed)으로 작성된 오버레이가 스타일 수정 없이 패널 기준으로 배치된다.
 * 패널 스크롤은 Boundary가 아닌 내부 Scroll 영역이 담당해 오버레이 기준 박스가 밀리지 않는다.
 */
export const PanelOverlayHost = ({ targetId, children }: Props) => {
  return (
    <OverlayPortalProvider targetId={targetId}>
      <div {...stylex.props(styles.boundary)}>
        <div {...stylex.props(styles.scroll)}>{children}</div>
        <div id={targetId} />
      </div>
    </OverlayPortalProvider>
  );
};
