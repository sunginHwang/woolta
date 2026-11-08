'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export type ProgressTone = 'primary' | 'brand' | 'success' | 'warning' | 'error';

/** 트랙 높이 4 / 8px */
export type ProgressSize = 'small' | 'medium';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** 진행률 0–100. 범위를 벗어나면 잘라낸다 */
  value: number;
  /**
   * 막대 색 역할
   * @default 'primary'
   */
  tone?: ProgressTone;
  /** 막대 위 왼쪽 제목 ("제주도 한 달 살기", "이달 예산") */
  title?: ReactNode;
  /** 막대 위 오른쪽 값 ("32%", "320,000원"). 없으면 `{value}%` */
  label?: ReactNode;
  /**
   * 막대 위 제목·값 행 표시 여부
   * @default true
   */
  showLabel?: boolean;
  /** 막대 아래 왼쪽 문구 ("3,200,000원") */
  startMessage?: ReactNode;
  /** 막대 아래 오른쪽 문구 ("목표 10,000,000원") */
  endMessage?: ReactNode;
  /**
   * 트랙 높이 (small 4 / medium 8px)
   * @default 'medium'
   */
  size?: ProgressSize;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: { width: '100%' },
  // 제목은 왼쪽, 값은 오른쪽 — 말풍선 대신 글줄로 숫자를 읽힌다
  head: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '0.8rem',
    marginBottom: '0.8rem',
    color: colorVars['--color-textSecondary'],
  },
  headValue: {
    marginLeft: 'auto',
    color: colorVars['--color-textPrimary'],
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  track: {
    width: '100%',
    overflow: 'hidden',
    borderRadius: '9999px',
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  bar: {
    height: '100%',
    borderRadius: '9999px',
    transitionProperty: 'width',
    transitionDuration: '300ms',
    transitionTimingFunction: 'ease',
  },
  messages: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.8rem',
    marginTop: '0.6rem',
    color: colorVars['--color-textTertiary'],
  },
});

const sizeStyles = stylex.create({
  small: { height: '0.4rem' },
  medium: { height: '0.8rem' },
});

const toneStyles = stylex.create({
  primary: { backgroundColor: colorVars['--color-interactivePrimary'] },
  brand: { backgroundColor: colorVars['--color-brandPrimary'] },
  success: { backgroundColor: colorVars['--color-statusSuccess'] },
  warning: { backgroundColor: colorVars['--color-statusWarning'] },
  error: { backgroundColor: colorVars['--color-statusError'] },
});

const dynamic = stylex.create({
  width: (percent: number) => ({ width: `${percent}%` }),
});

const clamp = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

/**
 * 진행률 막대. 위에 제목·값 한 줄, 아래에 시작/끝 문구를 둔다.
 * 버킷리스트 달성률, 예산 사용률처럼 "얼마나 왔는지"를 보여 줄 때 쓴다.
 *
 * - 숫자는 막대 위 오른쪽 `label` 로 읽힌다 (디자인 가이드: 말풍선 대신 글줄).
 * - 막대 색은 역할로 고른다. 예산처럼 "넘치면 나쁜" 값은 구간에 따라 success → warning → error.
 * @component
 */
export const Progress = ({
  value,
  tone = 'primary',
  title,
  label,
  showLabel = true,
  startMessage,
  endMessage,
  size = 'medium',
  xstyle,
  'aria-label': ariaLabel,
  ...rest
}: ProgressProps) => {
  const percent = clamp(value);

  return (
    <div {...rest} {...stylex.props(styles.root, xstyle)}>
      {showLabel && (
        <div {...stylex.props(typographyStyles.body4Medium, styles.head)}>
          {title !== undefined && <span>{title}</span>}
          <span {...stylex.props(typographyStyles.body4Bold, styles.headValue)}>
            {label ?? `${Math.round(percent)}%`}
          </span>
        </div>
      )}
      <div
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        aria-label={ariaLabel ?? (typeof title === 'string' ? title : '진행률')}
        {...stylex.props(styles.track, sizeStyles[size])}
      >
        <div {...stylex.props(styles.bar, toneStyles[tone], dynamic.width(percent))} />
      </div>
      {(startMessage !== undefined || endMessage !== undefined) && (
        <div {...stylex.props(typographyStyles.small1Regular, styles.messages)}>
          <span>{startMessage}</span>
          <span>{endMessage}</span>
        </div>
      )}
    </div>
  );
};
