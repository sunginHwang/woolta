'use client';

import * as stylex from '@stylexjs/stylex';
import { Portal } from '@wds';
import { colorVars, zIndexConsts } from '@wds/tokens.stylex';
import { FC, MouseEvent, PropsWithChildren, useCallback, useRef } from 'react';

interface Props extends PropsWithChildren {
  visible: boolean;
  onDeemClick?: () => void;
}

const Deem: FC<Props> = ({ visible, children, onDeemClick }) => {
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
    <Portal targetId='modalDeem'>
      <div ref={modalDeemRef} onClick={onModalDeemClick} {...stylex.props(styles.deem, visible && styles.deemVisible)}>
        {children}
      </div>
    </Portal>
  );
};

export default Deem;

const styles = stylex.create({
  deem: {
    position: 'fixed',
    visibility: 'hidden',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: zIndexConsts.modalDeem,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  deemVisible: {
    visibility: 'visible',
  },
});
