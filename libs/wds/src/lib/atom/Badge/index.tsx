'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** error = 알림(기본), brand = 브랜드 강조, neutral = 중립 카운트 */
export type BadgeTone = 'error' | 'brand' | 'neutral';

/** 카운트 알약 높이 16 / 18px */
export type BadgeSize = 'small' | 'medium';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** 알림 수. 0 이거나 없으면 그리지 않는다 */
  count?: number;
  /**
   * 이 값을 넘으면 `{max}+` 로 표시한다 (SEED: 99 → "99+")
   * @default 99
   */
  max?: number;
  /** true 면 숫자 없는 6px 점만 그린다 — 알림 존재 여부만 중요할 때 */
  dot?: boolean;
  /**
   * 색 역할
   * @default 'error'
   */
  tone?: BadgeTone;
  /**
   * 카운트 알약 높이 (small 16 / medium 18px)
   * @default 'medium'
   */
  size?: BadgeSize;
  /** 감쌀 요소(아이콘 등). 주면 그 우상단에 배지를 겹친다 */
  children?: ReactNode;
  /**
   * children 을 감쌀 때 우상단에서 안쪽으로 밀어 넣는 거리(px)
   * @default 0
   */
  offset?: number;
  /** 외부에서 주입하는 StyleX 스타일 — 배지 자체에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  wrapper: {
    position: 'relative',
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  indicator: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    borderRadius: '9999px',
    whiteSpace: 'nowrap',
    color: colorVars['--color-textInverse'],
  },
  anchored: {
    position: 'absolute',
    top: 0,
    right: 0,
    transform: 'translate(50%, -50%)',
    zIndex: 1,
  },
  dot: {
    width: '0.6rem',
    height: '0.6rem',
    padding: 0,
  },
});

const sizeStyles = stylex.create({
  small: { minWidth: '1.6rem', height: '1.6rem', paddingInline: '0.5rem' },
  medium: { minWidth: '1.8rem', height: '1.8rem', paddingInline: '0.6rem' },
});

const toneStyles = stylex.create({
  error: { backgroundColor: colorVars['--color-statusError'] },
  brand: { backgroundColor: colorVars['--color-brandPrimary'] },
  neutral: { backgroundColor: colorVars['--color-bgInverse'] },
});

const dynamic = stylex.create({
  offset: (px: number) => ({ top: `${px}px`, right: `${px}px` }),
});

const SIZE = {
  small: { box: sizeStyles.small, text: typographyStyles.small3Bold },
  medium: { box: sizeStyles.medium, text: typographyStyles.small2Bold },
} as const satisfies Record<BadgeSize, unknown>;

/** 표시할 문자열. 없으면 null (= 그리지 않음) */
const formatCount = (count: number | undefined, max: number) => {
  if (count === undefined || count <= 0) return null;
  return count > max ? `${max}+` : String(count);
};

/**
 * 알림 배지. 숫자 알약 또는 점으로 "확인할 것이 있음"을 알린다.
 * 단독으로 쓰거나 아이콘을 children 으로 감싸 우상단에 겹친다.
 * SEED 규칙: 1–99 는 숫자, 그 이상은 "99+", 0 은 숨김, 3개 이상의 탭에 동시에 달지 않는다.
 * @component
 */
export const Badge = ({
  count,
  max = 99,
  dot = false,
  tone = 'error',
  size = 'medium',
  children,
  offset = 0,
  xstyle,
  ...rest
}: BadgeProps) => {
  const text = formatCount(count, max);
  const visible = dot || text !== null;
  const ariaLabel = dot ? '새 알림 있음' : text ? `새 알림 ${text}개` : undefined;

  const indicator = visible ? (
    <span
      role='status'
      aria-label={ariaLabel}
      {...rest}
      {...stylex.props(
        styles.indicator,
        toneStyles[tone],
        dot ? styles.dot : [SIZE[size].box, SIZE[size].text],
        children !== undefined && styles.anchored,
        children !== undefined && offset !== 0 && dynamic.offset(offset),
        xstyle,
      )}
    >
      {dot ? null : text}
    </span>
  ) : null;

  if (children === undefined) {
    return indicator;
  }

  return (
    <span {...stylex.props(styles.wrapper)}>
      {children}
      {indicator}
    </span>
  );
};
