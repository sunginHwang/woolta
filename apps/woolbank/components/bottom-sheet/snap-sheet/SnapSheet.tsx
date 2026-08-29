'use client';

import * as stylex from '@stylexjs/stylex';
import { type PropsWithChildren, type ReactNode, useEffect } from 'react';
import Sheet from 'react-modal-sheet';

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

export const SnapSheet = ({ isOpen = false, snapPhase = 1, useDeem = true, header, onClose, children }: Props) => {
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
      <div onClick={onClose} {...stylex.props(styles.backdrop)} />
    </Sheet>
  );
};

const styles = stylex.create({
  backdrop: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(51, 51, 51, 0.5)',
    touchAction: 'none',
    opacity: 1,
  },
});
