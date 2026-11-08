'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export interface SegmentedControlItem {
  /** 선택 값 */
  value: string;
  /** 보이는 라벨. 짧게(한글 4자 내외) 유지한다 */
  label: string;
  /** 선택 불가 */
  disabled?: boolean;
}

/** 높이 small 32 / medium 40 */
export type SegmentedControlSize = 'small' | 'medium';

/**
 * - thumb: 회색 트랙 위로 흰 썸이 미끄러지는 알약 (woolbank 내역/달력 전환)
 * - outline: 테두리 구획, 선택 구획이 강조색으로 채워짐 (woolbank 지출/수입 전환)
 */
export type SegmentedControlVariant = 'thumb' | 'outline';

export interface SegmentedControlProps {
  /** 구획 목록. 2~5개를 권장한다. 그 이상이면 Tabs 를 쓴다 */
  items: SegmentedControlItem[];
  /** 선택된 값 */
  value: string;
  /** 선택이 바뀔 때 (클릭·키보드 모두) */
  onChange?: (value: string) => void;
  /**
   * 스타일 변형
   * @default 'thumb'
   */
  variant?: SegmentedControlVariant;
  /**
   * 높이 32 / 40px
   * @default 'medium'
   */
  size?: SegmentedControlSize;
  /**
   * 부모 폭을 꽉 채운다. 아니면 내용에 맞추되 구획 최소 폭 56px
   * @default false
   */
  fill?: boolean;
  /** 그룹의 접근성 이름 */
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
  },
  fill: { display: 'flex', width: '100%' },
  thumbRoot: {
    padding: '0.2rem',
    borderRadius: '9999px',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  outlineRoot: {
    borderRadius: '1.3rem',
  },
  segment: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: '5.6rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingInline: '1.2rem',
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: colorVars['--color-textTertiary'],
    whiteSpace: 'nowrap',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  thumbSegment: { borderRadius: '9999px' },
  thumbSegmentSelected: { color: colorVars['--color-textPrimary'] },
  outlineSegment: {
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    marginLeft: '-1px',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  outlineSegmentFirst: {
    marginLeft: 0,
    borderTopLeftRadius: '1.3rem',
    borderBottomLeftRadius: '1.3rem',
  },
  outlineSegmentLast: {
    borderTopRightRadius: '1.3rem',
    borderBottomRightRadius: '1.3rem',
  },
  outlineSegmentSelected: {
    zIndex: 2,
    color: colorVars['--color-textInverse'],
    backgroundColor: colorVars['--color-interactivePrimary'],
    borderColor: colorVars['--color-interactivePrimary'],
  },
  thumb: {
    position: 'absolute',
    top: '0.2rem',
    bottom: '0.2rem',
    left: 0,
    borderRadius: '9999px',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderDefault'],
    boxSizing: 'border-box',
    transitionProperty: 'transform, width',
    transitionDuration: '0.25s',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
  },
  thumbHidden: { visibility: 'hidden' },
});

const sizeStyles = stylex.create({
  small: { height: '3.2rem' },
  medium: { height: '4rem' },
});

const dynamic = stylex.create({
  thumb: (x: number, width: number) => ({
    transform: `translateX(${x}px)`,
    width: `${width}px`,
  }),
});

/**
 * 둘 이상의 상호 배타적 보기(내역/달력, 지출/수입)를 한 줄에서 전환하는 컨트롤.
 * Tabs 와 달리 패널이 아니라 "같은 내용의 보기 방식"이나 폼 값을 바꿀 때 쓴다.
 * (woolbank AccountBookTabs·ToggleTab 을 공용화한 것)
 * @component
 */
export const SegmentedControl = ({
  items,
  value,
  onChange,
  variant = 'thumb',
  size = 'medium',
  fill = false,
  'aria-label': ariaLabel,
  xstyle,
}: SegmentedControlProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [thumb, setThumb] = useState<{ x: number; width: number } | null>(null);

  const measure = useCallback(() => {
    const root = rootRef.current;
    const selected = segmentRefs.current[value];
    if (!root || !selected) {
      setThumb(null);
      return;
    }
    // 트랙 안쪽 여백(0.2rem) 기준으로 썸을 맞춘다
    setThumb({ x: selected.offsetLeft - root.clientLeft - 2, width: selected.offsetWidth });
  }, [value]);

  useLayoutEffect(() => {
    measure();
    const root = rootRef.current;
    if (!root || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(root);
    return () => observer.disconnect();
  }, [measure]);

  const select = (next: SegmentedControlItem) => {
    if (next.disabled || next.value === value) return;
    onChange?.(next.value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.value === value);
    if (enabled.length === 0) return;
    const step = event.key === 'ArrowRight' ? 1 : -1;
    const next = enabled[(current + step + enabled.length) % enabled.length];
    onChange?.(next.value);
    segmentRefs.current[next.value]?.focus();
  };

  const isThumb = variant === 'thumb';

  return (
    <div
      ref={rootRef}
      role='radiogroup'
      aria-label={ariaLabel}
      {...stylex.props(
        styles.root,
        sizeStyles[size],
        isThumb ? styles.thumbRoot : styles.outlineRoot,
        fill && styles.fill,
        xstyle,
      )}
    >
      {isThumb && (
        <span
          aria-hidden='true'
          data-testid='segmented-thumb'
          {...stylex.props(styles.thumb, thumb ? dynamic.thumb(thumb.x, thumb.width) : styles.thumbHidden)}
        />
      )}
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          // biome-ignore lint/a11y/useSemanticElements: 세그먼트는 썸 애니메이션·스타일 때문에 button 으로 그리고 radio 의미만 빌린다
          <button
            key={item.value}
            ref={(node) => {
              segmentRefs.current[item.value] = node;
            }}
            type='button'
            role='radio'
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            disabled={item.disabled}
            data-value={item.value}
            onClick={() => select(item)}
            onKeyDown={onKeyDown}
            {...stylex.props(
              selected ? typographyStyles.title6Bold : typographyStyles.body4Medium,
              styles.segment,
              isThumb && styles.thumbSegment,
              isThumb && selected && styles.thumbSegmentSelected,
              !isThumb && styles.outlineSegment,
              !isThumb && index === 0 && styles.outlineSegmentFirst,
              !isThumb && index === items.length - 1 && styles.outlineSegmentLast,
              !isThumb && selected && styles.outlineSegmentSelected,
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
};
