'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IconCircleCheck, IconCloseCircle } from '../../icons';
import { colorVars, shadowVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';
import { OVERLAY_TRANSITION_MS, useTransitionPresence } from '../Overlay';

export type ToastTone = 'neutral' | 'success' | 'error';
export type ToastPosition = 'bottom' | 'center';

export interface ToastProps {
  /** 표시 여부. false 가 되면 fade-out 뒤 비워진다 (live region 자체는 항상 남는다) */
  open: boolean;
  /** 메시지. 한 줄로 끝나는 짧은 문장 */
  message?: string;
  /**
   * 의미 아이콘. neutral 은 아이콘 없음
   * @default 'neutral'
   */
  tone?: ToastTone;
  /** 오른쪽 액션 라벨("보기", "실행 취소"). 한 단어 */
  actionLabel?: string;
  /** 액션 클릭 */
  onAction?: () => void;
  /**
   * 위치. bottom 은 하단 내비게이션 위, center 는 화면 정중앙(woolbank 기존 위치)
   * @default 'bottom'
   */
  position?: ToastPosition;
  /** 외부에서 주입하는 StyleX 스타일 — 박스에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  region: {
    position: 'fixed',
    left: '50%',
    zIndex: zIndexConsts.notification,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    maxWidth: 'calc(100% - 3.2rem)',
  },
  regionBottom: {
    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 7.2rem)',
    transform: 'translateX(-50%)',
  },
  regionCenter: {
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
  pill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.8rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
    borderRadius: '1.2rem',
    boxShadow: shadowVars['--shadow-popover'],
    pointerEvents: 'auto',
    backgroundColor: colorVars['--color-bgInverse'],
    color: colorVars['--color-textInverse'],
    opacity: 0,
    transform: 'translateY(0.8rem)',
    transitionProperty: 'opacity, transform',
    transitionDuration: '200ms', // = OVERLAY_TRANSITION_MS (StyleX 는 import 상수를 못 쓴다)
    transitionTimingFunction: 'ease',
  },
  pillVisible: { opacity: 1, transform: 'translateY(0)' },
  // 상태는 색 점 대신 아이콘 + 단어로 — 색상 차이에만 기대지 않는다
  icon: { display: 'inline-flex', flexShrink: 0 },
  iconSuccess: { color: colorVars['--color-statusSuccess'] },
  iconError: { color: colorVars['--color-statusError'] },
  message: { margin: 0 },
  action: {
    marginLeft: '0.4rem',
    padding: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: 'inherit',
    textDecorationLine: 'underline',
    textUnderlineOffset: '0.2rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
});

/**
 * 짧은 상태 메시지 알약. 보통 직접 쓰지 않고 `ToastProvider` + `useToast()` 로 띄운다.
 * live region(`role=status`)은 항상 렌더링돼 스크린리더가 새 메시지를 읽는다.
 */
export const Toast = ({
  open,
  message,
  tone = 'neutral',
  position = 'bottom',
  actionLabel,
  onAction,
  xstyle,
}: ToastProps) => {
  const { mounted, visible } = useTransitionPresence(open);
  // 닫히는 전환 동안에도 마지막 메시지를 유지한다
  const lastMessageRef = useRef(message);
  if (message !== undefined) lastMessageRef.current = message;

  return (
    <div
      role='status'
      aria-live='polite'
      {...stylex.props(styles.region, position === 'bottom' ? styles.regionBottom : styles.regionCenter)}
    >
      {mounted && (
        <div {...stylex.props(styles.pill, visible && styles.pillVisible, xstyle)}>
          {tone !== 'neutral' && (
            <span
              aria-hidden='true'
              {...stylex.props(styles.icon, tone === 'success' ? styles.iconSuccess : styles.iconError)}
            >
              {tone === 'success' ? (
                <IconCircleCheck size={20} />
              ) : (
                <IconCloseCircle size={20} />
              )}
            </span>
          )}
          <p {...stylex.props(typographyStyles.body3, styles.message)}>{lastMessageRef.current}</p>
          {actionLabel && (
            <button type='button' onClick={onAction} {...stylex.props(typographyStyles.body4Bold, styles.action)}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export interface ToastOptions {
  /**
   * 자동으로 사라지기까지의 시간(ms)
   * @default 2500
   */
  duration?: number;
  tone?: ToastTone;
  /** 오른쪽 액션 라벨("보기"). 주면 onAction 과 함께 버튼이 붙는다 */
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastItem
  extends Required<Pick<ToastOptions, 'duration' | 'tone'>>,
    Pick<ToastOptions, 'actionLabel' | 'onAction'> {
  id: number;
  message: string;
}

interface ToastContextValue {
  /** 메시지를 띄운다. 이미 하나가 떠 있으면 그 뒤에 이어서 보여준다 */
  show: (message: string, options?: ToastOptions) => void;
  /** 지금 떠 있는 토스트를 즉시 닫는다 (대기열은 유지) */
  hide: () => void;
}

const ToastContext = createContext<ToastContextValue>({
  show: () => undefined,
  hide: () => undefined,
});

export const useToast = () => useContext(ToastContext);

export interface ToastProviderProps {
  /**
   * 기본 표시 시간(ms)
   * @default 2500
   */
  duration?: number;
  /** @default 'bottom' */
  position?: ToastPosition;
  children: ReactNode;
}

/**
 * 토스트 상태를 들고 `<Toast>` 를 한 번만 렌더링하는 provider. 앱 루트에 한 번 둔다.
 * (woolbank 의 jotai toastAtom + useToast 를 대체한다)
 */
export const ToastProvider = ({ duration = 2500, position = 'bottom', children }: ToastProviderProps) => {
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const [queue, setQueue] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useCallback(
    (message: string, options?: ToastOptions) => {
      const item: ToastItem = {
        id: ++idRef.current,
        message,
        duration: options?.duration ?? duration,
        tone: options?.tone ?? 'neutral',
        actionLabel: options?.actionLabel,
        onAction: options?.onAction,
      };
      setCurrent((prev) => {
        if (prev === null) return item;
        setQueue((q) => [...q, item]);
        return prev;
      });
    },
    [duration],
  );

  const hide = useCallback(() => setCurrent(null), []);

  // 표시 시간이 지나면 닫는다
  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => setCurrent(null), current.duration);
    return () => clearTimeout(timer);
  }, [current]);

  // 닫힘 전환이 끝난 뒤 대기열의 다음 메시지를 꺼낸다
  useEffect(() => {
    if (current || queue.length === 0) return;
    const timer = setTimeout(() => {
      setQueue(([next, ...rest]) => {
        if (next) setCurrent(next);
        return rest;
      });
    }, OVERLAY_TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [current, queue.length]);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast
        open={current !== null}
        message={current?.message}
        tone={current?.tone}
        position={position}
        actionLabel={current?.actionLabel}
        onAction={() => {
          current?.onAction?.();
          hide();
        }}
      />
    </ToastContext.Provider>
  );
};
