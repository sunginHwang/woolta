'use client';
import { useEffect, PropsWithChildren, ReactNode } from 'react';
import Sheet from 'react-modal-sheet';
import styled from 'styled-components';

interface Props extends PropsWithChildren {
  isOpen?: boolean;
  onClose: () => void;
  header?: ReactNode;
  snapPhase?: number;
  useDeem?: boolean;
}

export const SnapSheet = ({ isOpen = false, snapPhase = 1, useDeem = true, header, onClose, children }: Props) => {
  const MAX_Y = window.innerHeight - 140;

  useEffect(() => {
    const BODY_ELEMENT = document.querySelector('body');

    if (!BODY_ELEMENT || !useDeem) {
      return;
    }

    isOpen ? (BODY_ELEMENT.style.overflow = 'hidden') : BODY_ELEMENT.style.removeProperty('overflow');
  }, [isOpen, useDeem]);

  return (
    <Sheet
      disableScrollLocking={true}
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[MAX_Y, 600, 400, 300, 100, 0]}
      initialSnap={snapPhase}
    >
      <Sheet.Container>
        {header || <Sheet.Header />}
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <SC.Backdrop onClick={onClose} />
    </Sheet>
  );
};

const SC = {
  Backdrop: styled.div`
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(51, 51, 51, 0.5);
    touch-action: none;
    opacity: 1;
  `,
};
