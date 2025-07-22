'use client';
import { useEffect, FC, PropsWithChildren, ReactNode } from 'react';
import Sheet from 'react-modal-sheet';
import styled from 'styled-components';

interface Props extends PropsWithChildren {
  // 시트 열기 닫기
  isOpen?: boolean;
  // 시트 닫기
  onClose: () => void;
  // customHeader태그
  header?: ReactNode;
  // 올라오는 phase 정하기
  snapPhase?: number;
  // 딤처리 사용여부
  useDeem?: boolean;
}

const SnapSheet: FC<Props> = ({ isOpen = false, snapPhase = 1, useDeem = true, header, onClose, children }) => {
  const MAX_Y = window.innerHeight - 140; // 바텀시트가 최소로 내려갔을 때의 y 값

  useEffect(() => {
    const BODY_ELEMENT = document.querySelector('body');

    if (!BODY_ELEMENT) {
      return;
    }

    if (!useDeem) {
      return;
    }

    isOpen ? (BODY_ELEMENT.style.overflow = 'hidden') : BODY_ELEMENT.style.removeProperty('overflow');
  }, [isOpen, useDeem]);

  return (
    <Sheet
      disableScrollLocking={true}
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      snapPoints={[MAX_Y, 600, 400, 300, 100, 0]}
      initialSnap={snapPhase}
    >
      <Sheet.Container>
        {header || <Sheet.Header />}
        <Sheet.Content>{children}</Sheet.Content>
      </Sheet.Container>
      <SC.backdrop onClick={onClose}></SC.backdrop>
    </Sheet>
  );
};

export default SnapSheet;

const SC = {
  backdrop: styled.div`
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
