'use client';

import { PointerEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

interface Props {
  left: ReactNode;
  right: ReactNode;
  /** 좌측 패널 기본 폭(px) */
  defaultLeftWidth?: number;
  /** 좌측 패널 최소 폭(px) */
  minLeftWidth?: number;
  /** 좌측 패널 최대 폭(px) */
  maxLeftWidth?: number;
  /** 지정하면 조절된 폭을 localStorage에 유지한다 (앱별 고유 키 권장, 예: 'bank') */
  storageKey?: string;
}

const getStorageId = (storageKey: string) => `woolta:split-pane:${storageKey}`;

/**
 * 콘텐츠 영역을 좌/우 두 패널로 나누고, 중앙 바 드래그로 좌측 폭을 조절하는 컴포넌트.
 * 전역 레이아웃이 아니라 필요한 앱 화면에서 선택적으로 사용한다.
 * 중앙 바 더블클릭 시 기본 폭으로 초기화된다.
 */
const SplitPane = ({
  left,
  right,
  defaultLeftWidth = 320,
  minLeftWidth = 200,
  maxLeftWidth = 640,
  storageKey,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);

  const clampWidth = (width: number) => Math.min(maxLeftWidth, Math.max(minLeftWidth, width));

  useEffect(() => {
    if (!storageKey) {
      return;
    }

    const saved = window.localStorage.getItem(getStorageId(storageKey));
    const savedWidth = Number(saved);

    if (saved !== null && !Number.isNaN(savedWidth)) {
      setLeftWidth(clampWidth(savedWidth));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const saveWidth = (width: number) => {
    if (storageKey) {
      window.localStorage.setItem(getStorageId(storageKey), String(width));
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) {
      return;
    }

    const { left: containerLeft } = containerRef.current.getBoundingClientRect();
    setLeftWidth(clampWidth(e.clientX - containerLeft));
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    saveWidth(leftWidth);
  };

  const handleReset = () => {
    setLeftWidth(defaultLeftWidth);
    saveWidth(defaultLeftWidth);
  };

  return (
    <SC.Container ref={containerRef} $isDragging={isDragging}>
      <SC.LeftPane style={{ width: leftWidth }}>{left}</SC.LeftPane>
      <SC.Divider
        role='separator'
        aria-orientation='vertical'
        title='드래그해서 폭 조절, 더블클릭으로 초기화'
        $isDragging={isDragging}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleReset}
      />
      <SC.RightPane>{right}</SC.RightPane>
    </SC.Container>
  );
};

export default SplitPane;

const SC = {
  Container: styled.div<{ $isDragging: boolean }>`
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    ${({ $isDragging }) => $isDragging && 'user-select: none; cursor: col-resize;'}
  `,
  LeftPane: styled.div`
    flex-shrink: 0;
    height: 100%;
    overflow-y: auto;
  `,
  RightPane: styled.div`
    flex: 1;
    min-width: 0;
    height: 100%;
    overflow-y: auto;
  `,
  Divider: styled.div<{ $isDragging: boolean }>`
    flex-shrink: 0;
    width: 0.5rem;
    height: 100%;
    cursor: col-resize;
    touch-action: none;
    background-color: ${({ theme, $isDragging }) =>
      $isDragging ? theme.colors.interactivePrimary : theme.colors.borderSubtle};
    background-clip: content-box;
    padding: 0 0.2rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.interactivePrimary};
      background-clip: content-box;
    }
  `,
};
