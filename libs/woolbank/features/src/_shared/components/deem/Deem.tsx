'use client';

import { useOverlayPortalTargetId } from '@common';
import * as stylex from '@stylexjs/stylex';
import { Portal } from '@wds';
import { zIndexConsts } from '@wds/tokens.stylex';
import { type FC, type MouseEvent, type PropsWithChildren, useCallback, useRef } from 'react';

interface Props extends PropsWithChildren {
  visible: boolean;
  onDeemClick?: () => void;
}

const styles = stylex.create({
  deem: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: zIndexConsts.modalDeem,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  visible: { visibility: 'visible' },
  hidden: { visibility: 'hidden' },
});

const Deem: FC<Props> = ({ visible, children, onDeemClick }) => {
  // 호스트가 OverlayPortalProvider로 패널 내부 요소를 주입하면 그 안에서만 노출된다. 기본은 전역 #modalDeem.
  const portalTargetId = useOverlayPortalTargetId();
  const modalDeemRef = useRef(null);

  const onModalDeemClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (e.target && modalDeemRef.current === e.target) {
        onDeemClick && onDeemClick();
      }
    },
    [onDeemClick],
  );

  return (
    <Portal targetId={portalTargetId}>
      <div
        ref={modalDeemRef}
        onClick={onModalDeemClick}
        {...stylex.props(styles.deem, visible ? styles.visible : styles.hidden)}
      >
        {children}
      </div>
    </Portal>
  );
};

export default Deem;
