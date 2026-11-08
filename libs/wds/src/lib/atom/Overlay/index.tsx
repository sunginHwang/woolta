'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { MouseEvent, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { colorVars, zIndexConsts } from '../../style/tokens.stylex';
import { Portal } from '../Portal';

/** 열림/닫힘 전환 시간(ms). Overlay·BottomSheet·Toast 가 같은 값을 쓴다 */
export const OVERLAY_TRANSITION_MS = 200;

/**
 * CSS 전환이 끝날 때까지 마운트를 유지하는 presence 훅.
 * - open → true: 먼저 마운트하고 다음 프레임에 visible 을 켜 enter 전환이 그려지게 한다
 * - open → false: visible 을 끄고 duration 뒤에 언마운트한다
 */
export const useTransitionPresence = (open: boolean, duration = OVERLAY_TRANSITION_MS) => {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = setTimeout(() => setMounted(false), duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return { mounted, visible };
};

export type OverlayAlign = 'center' | 'bottom' | 'none';

export interface OverlayProps {
  /** 열림 여부. false 가 되면 fade-out 뒤에 언마운트된다 */
  open: boolean;
  /** 딤(어두운 배경) 자체를 클릭했을 때. 안쪽 콘텐츠 클릭에는 호출되지 않는다 */
  onClick?: () => void;
  /** Escape 키를 눌렀을 때 */
  onClose?: () => void;
  /**
   * 콘텐츠 배치. center=가운데, bottom=하단 정렬(바텀시트), none=콘텐츠가 스스로 위치를 잡는다
   * @default 'center'
   */
  align?: OverlayAlign;
  /**
   * 열려 있는 동안 body 스크롤을 잠근다
   * @default true
   */
  lockScroll?: boolean;
  /** 지정한 id 의 요소가 있으면 그 안으로 포털 렌더링한다(없으면 제자리 렌더링) */
  portalTargetId?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const styles = stylex.create({
  root: {
    position: 'fixed',
    inset: 0,
    zIndex: zIndexConsts.modalDeem,
    display: 'flex',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: `${OVERLAY_TRANSITION_MS}ms`,
    transitionTimingFunction: 'ease',
  },
  rootVisible: { opacity: 1 },
  alignCenter: { alignItems: 'center', justifyContent: 'center' },
  alignBottom: { alignItems: 'flex-end', justifyContent: 'center' },
  alignNone: { display: 'block' },
  dim: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colorVars['--color-bgOverlay'],
  },
  // 절대 배치된 딤보다 위에 오도록 상대 배치 + z-index
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '100%',
    maxHeight: '100%',
  },
  contentBottom: { width: '100%' },
});

/**
 * 화면 전체를 덮는 딤 레이어. 모달·바텀시트·전체 화면 로딩의 바닥이 된다.
 * (woolbank 의 Deem 을 옮긴 것 — 포털 대상은 prop 으로 받는다)
 */
export const Overlay = ({
  open,
  onClick,
  onClose,
  align = 'center',
  lockScroll = true,
  portalTargetId,
  xstyle,
  children,
}: OverlayProps) => {
  const { mounted, visible } = useTransitionPresence(open);
  const [hasPortalTarget, setHasPortalTarget] = useState(false);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasPortalTarget(Boolean(portalTargetId && document.getElementById(portalTargetId)));
  }, [portalTargetId]);

  // body 스크롤 잠금 — 닫히면 원래 값으로 되돌린다
  useEffect(() => {
    if (!open || !lockScroll) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, lockScroll]);

  useEffect(() => {
    if (!open || !onClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  const handleDimClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === dimRef.current) onClick?.();
  };

  const node = (
    <div
      data-overlay-root=''
      {...stylex.props(
        styles.root,
        visible && styles.rootVisible,
        align === 'center' && styles.alignCenter,
        align === 'bottom' && styles.alignBottom,
        align === 'none' && styles.alignNone,
        xstyle,
      )}
    >
      <div ref={dimRef} aria-hidden='true' data-overlay-dim='' onClick={handleDimClick} {...stylex.props(styles.dim)} />
      {children !== undefined && (
        <div {...stylex.props(styles.content, align === 'bottom' && styles.contentBottom)}>{children}</div>
      )}
    </div>
  );

  return hasPortalTarget && portalTargetId ? <Portal targetId={portalTargetId}>{node}</Portal> : node;
};
