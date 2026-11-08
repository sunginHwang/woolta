'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes } from 'react';
import { colorVars } from '../../style/tokens.stylex';

/** 지름 16 / 24 / 40px */
export type SpinnerSize = 'small' | 'medium' | 'large';

/** current = 글자색 상속(버튼 안), primary = 강조색, inverse = 어두운 배경 위 */
export type SpinnerColor = 'current' | 'primary' | 'inverse';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * 지름 (small 16 / medium 24 / large 40px)
   * @default 'medium'
   */
  size?: SpinnerSize;
  /**
   * 링 색. current 는 부모 글자색을 따른다
   * @default 'current'
   */
  color?: SpinnerColor;
  /**
   * 스크린리더가 읽는 라벨
   * @default '로딩 중'
   */
  label?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
}

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
  ring: {
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderTopColor: 'transparent',
    animationName: spin,
    animationDuration: '0.8s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  // 시각적으로 숨기고 스크린리더에만 노출
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
});

const sizeStyles = stylex.create({
  small: { width: '1.6rem', height: '1.6rem' },
  medium: { width: '2.4rem', height: '2.4rem' },
  large: { width: '4rem', height: '4rem' },
  smallRing: { borderWidth: '0.2rem' },
  mediumRing: { borderWidth: '0.25rem' },
  largeRing: { borderWidth: '0.4rem' },
});

const colorStyles = stylex.create({
  current: { color: 'currentColor' },
  primary: { color: colorVars['--color-interactivePrimary'] },
  inverse: { color: colorVars['--color-textInverse'] },
});

const SIZE = {
  small: { box: sizeStyles.small, ring: sizeStyles.smallRing },
  medium: { box: sizeStyles.medium, ring: sizeStyles.mediumRing },
  large: { box: sizeStyles.large, ring: sizeStyles.largeRing },
} as const satisfies Record<SpinnerSize, unknown>;

/**
 * 회전하는 링 로딩 표시. react-spinners 의 ClipLoader 를 대체한다.
 * 버튼 안·목록 끝·전체 화면 등 어디서든 같은 모양을 쓴다.
 * @component
 */
export const Spinner = ({ size = 'medium', color = 'current', label = '로딩 중', xstyle, ...rest }: SpinnerProps) => (
  <span
    role='status'
    aria-label={label}
    {...rest}
    {...stylex.props(styles.root, SIZE[size].box, colorStyles[color], xstyle)}
  >
    <span aria-hidden='true' {...stylex.props(styles.ring, SIZE[size].ring)} />
    <span {...stylex.props(styles.srOnly)}>{label}</span>
  </span>
);
