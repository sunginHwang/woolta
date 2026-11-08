'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { colorVars, shadowVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';
import { Overlay, useTransitionPresence } from '../Overlay';

export interface BottomSheetProps {
  /** 열림 여부. false 가 되면 아래로 내려간 뒤 언마운트된다 */
  open: boolean;
  /** 딤 클릭·✕ 버튼·Escape 로 닫힐 때 */
  onClose: () => void;
  /** 헤더 제목. 없으면 헤더를 그리지 않는다 */
  title?: string;
  /**
   * 헤더의 ✕ 닫기 버튼 표시 (title 이 있을 때만)
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * 시트 최대 높이. 넘치는 내용은 시트 안에서 스크롤한다
   * @default '85dvh'
   */
  maxHeight?: string;
  /** 내용 영역의 최대 높이(px). 시트 전체가 아니라 스크롤 영역만 제한한다 */
  contentHeight?: number;
  /** 지정한 id 의 요소가 있으면 그 안으로 포털 렌더링한다 */
  portalTargetId?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 시트 패널에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const styles = stylex.create({
  panel: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: shadowVars['--shadow-overlay'],
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    // tabIndex=-1 로 포커스를 받지만 UA 의 outline: auto 링은 그리지 않는다 (width 0 만으로는 auto 를 못 막는다)
    outlineStyle: 'none',
    transform: 'translateY(100%)',
    transitionProperty: 'transform',
    transitionDuration: '200ms', // = OVERLAY_TRANSITION_MS (StyleX 는 import 상수를 못 쓴다)
    transitionTimingFunction: 'ease-in-out',
  },
  panelVisible: { transform: 'translateY(0)' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.2rem',
    paddingBlock: '2rem',
    paddingInline: '2rem',
    flexShrink: 0,
  },
  title: {
    color: colorVars['--color-textPrimary'],
    margin: 0,
  },
  closeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3.2rem',
    height: '3.2rem',
    marginRight: '-0.6rem',
    borderWidth: 0,
    borderRadius: '50%',
    backgroundColor: 'transparent',
    color: colorVars['--color-textSecondary'],
    cursor: 'pointer',
    outlineWidth: { default: 0, ':focus-visible': '0.2rem' },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  // 시트는 maxHeight 까지만 자라고, 넘치는 목록은 content 안에서 스크롤한다
  content: {
    overflowY: 'auto',
    minHeight: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    marginBottom: '2.5rem',
  },
  contentNoHeader: { paddingTop: '2rem' },
});

const dynamic = stylex.create({
  maxHeight: (value: string) => ({ maxHeight: value }),
  contentHeight: (px: number) => ({ maxHeight: `${px}px` }),
});

const CloseIcon = () => (
  <svg width='20' height='20' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
    <path d='M5 5l10 10M15 5L5 15' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
  </svg>
);

/**
 * 화면 아래에서 올라오는 시트. 선택지·짧은 폼·보조 정보를 현재 화면 위에 띄울 때 쓴다.
 * 열리면 시트에 포커스를 주고, 닫히면 열기 전 요소로 포커스를 되돌린다.
 * (woolbank DefaultBottomSheet 를 옮긴 것 — 스크롤 잠금은 Overlay 가 담당한다)
 */
const BottomSheetBase = ({
  open,
  onClose,
  title,
  showCloseButton = true,
  maxHeight = '85dvh',
  contentHeight,
  portalTargetId,
  xstyle,
  children,
}: BottomSheetProps) => {
  const { visible } = useTransitionPresence(open);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);

  // 열릴 때 시트로 포커스, 닫힐 때 원래 요소로 복귀
  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement as HTMLElement | null;
      const frame = requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }));
      return () => cancelAnimationFrame(frame);
    }
    restoreFocusRef.current?.focus?.({ preventScroll: true });
    restoreFocusRef.current = null;
  }, [open]);

  return (
    <Overlay open={open} align='bottom' onClick={onClose} onClose={onClose} portalTargetId={portalTargetId}>
      <div
        ref={panelRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        {...stylex.props(styles.panel, dynamic.maxHeight(maxHeight), visible && styles.panelVisible, xstyle)}
      >
        {title && (
          <div {...stylex.props(styles.header)}>
            <h2 id={titleId} {...stylex.props(typographyStyles.title2Bold, styles.title)}>
              {title}
            </h2>
            {showCloseButton && (
              <button type='button' aria-label='닫기' onClick={onClose} {...stylex.props(styles.closeButton)}>
                <CloseIcon />
              </button>
            )}
          </div>
        )}
        <div
          {...stylex.props(
            styles.content,
            !title && styles.contentNoHeader,
            contentHeight !== undefined && dynamic.contentHeight(contentHeight),
          )}
        >
          {children}
        </div>
      </div>
    </Overlay>
  );
};

export interface BottomSheetMenuItem {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface BottomSheetMenuProps extends Pick<BottomSheetProps, 'open' | 'onClose' | 'portalTargetId'> {
  /** 시트 제목. listbox 의 접근성 이름으로도 쓰인다 */
  title: string;
  /** 선택지 목록 */
  items: BottomSheetMenuItem[];
  /** 현재 선택된 값 */
  value?: string;
  /** 항목을 고르면 호출된다. 닫기는 호출하는 쪽에서 onClose 로 처리한다 */
  onSelect: (value: string) => void;
}

const menuStyles = stylex.create({
  list: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
  item: {
    paddingBlock: '1.4rem',
    paddingInline: '1.4rem',
    borderRadius: '0.8rem',
    color: colorVars['--color-textSecondary'],
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    cursor: 'pointer',
    outlineWidth: { default: 0, ':focus-visible': '0.2rem' },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  itemSelected: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    color: colorVars['--color-textPrimary'],
  },
  itemDisabled: {
    color: colorVars['--color-textDisabled'],
    cursor: 'not-allowed',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  // 마지막 항목 아래 safe-area 만큼 여백을 둔다 (woolbank Menu 와 같다)
  itemLast: { marginBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' },
});

/**
 * 단일 선택 메뉴 시트. 필터·정렬·기간처럼 선택지가 몇 개인 값을 고를 때 쓴다.
 * (woolbank MenuSheet 를 옮긴 것)
 */
export const BottomSheetMenu = ({
  open,
  onClose,
  portalTargetId,
  title,
  items,
  value,
  onSelect,
}: BottomSheetMenuProps) => {
  const titleId = useId();

  const select = (item: BottomSheetMenuItem) => {
    if (item.disabled) return;
    onSelect(item.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: BottomSheetMenuItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(item);
    }
  };

  return (
    <BottomSheetBase open={open} onClose={onClose} title={title} portalTargetId={portalTargetId}>
      <div role='listbox' aria-labelledby={titleId} aria-label={title} {...stylex.props(menuStyles.list)}>
        {items.map((item, index) => {
          const selected = item.value === value;
          return (
            <div
              key={item.value}
              role='option'
              aria-selected={selected}
              aria-disabled={item.disabled || undefined}
              tabIndex={item.disabled ? -1 : 0}
              onClick={() => select(item)}
              onKeyDown={(event) => onKeyDown(event, item)}
              {...stylex.props(
                typographyStyles.title4Medium,
                menuStyles.item,
                selected && menuStyles.itemSelected,
                item.disabled && menuStyles.itemDisabled,
                index === items.length - 1 && menuStyles.itemLast,
              )}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </BottomSheetBase>
  );
};

export const BottomSheet = Object.assign(BottomSheetBase, { Menu: BottomSheetMenu });
