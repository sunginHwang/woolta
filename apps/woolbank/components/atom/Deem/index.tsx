import { styled } from 'styled-components';
import { Portal } from '@wds';
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
      <SC.Deem ref={modalDeemRef} visible={visible} onClick={onModalDeemClick}>
        {children}
      </SC.Deem>
    </Portal>
  );
};

export default Deem;

const SC = {
  Deem: styled.div<{ visible: boolean }>`
    position: fixed;
    visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: ${({ theme }) => theme.zIndex.modalDeem};
    background-color: rgba(0, 0, 0, 0.75);
  `,
};
