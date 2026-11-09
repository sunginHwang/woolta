'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 높이 small 36 / medium 42 / large 52 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * - primary: 채운 강조색. 화면의 주 액션(저장·제출) 하나에만 쓴다
 * - secondary: 회색 채움. 주 액션 옆의 보조 액션
 * - outline: 회색 테두리. 취소·삭제처럼 눈에 덜 띄어야 하는 액션
 * - outlinePrimary: 강조색 테두리. 주 액션과 짝이 되는 대안 액션
 * - text: 배경·테두리 없는 글자 버튼. 헤더 우측 "＋ 추가" 같은 가벼운 액션
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'outlinePrimary' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 스타일 변형
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * 크기 (높이 36 / 42 / 52px)
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * 부모 폭을 꽉 채운다 (하단 고정 버튼·폼 제출 버튼)
   * @default false
   */
  fill?: boolean;
  /**
   * 처리 중 표시. 스피너를 보이고 클릭을 막되, 버튼 폭은 유지한다
   * @default false
   */
  loading?: boolean;
  /** 텍스트 왼쪽 아이콘 */
  startIcon?: ReactNode;
  /** 텍스트 오른쪽 아이콘 */
  endIcon?: ReactNode;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지되어 오버라이드 가능하다 */
  xstyle?: StyleXStyles;
}

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  base: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    boxSizing: 'border-box',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    borderRadius: '0.8rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':active': 0.7,
    },
    transitionProperty: 'background-color, color, border-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    // 키보드 포커스일 때만 링을 그린다
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  fill: { width: '100%' },
  // 로딩 중에는 내용을 투명하게 두어 폭이 흔들리지 않게 한다
  contentHidden: { visibility: 'hidden' },
  iconSlot: { display: 'inline-flex', flexShrink: 0 },
  spinnerWrap: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '1.8rem',
    height: '1.8rem',
    borderRadius: '50%',
    borderWidth: '0.2rem',
    borderStyle: 'solid',
    borderColor: 'currentColor',
    borderTopColor: 'transparent',
    animationName: spin,
    animationDuration: '0.8s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
});

const sizeStyles = stylex.create({
  small: { height: '3.6rem', minWidth: '6.4rem', paddingInline: '1.2rem' },
  medium: { height: '4.2rem', minWidth: '5.8rem', paddingInline: '1.6rem' },
  large: { height: '5.2rem', minWidth: '4.8rem', paddingInline: '2.4rem', borderRadius: '1.2rem' },
});

// text 변형은 글자만 있어 좌우 여백을 줄이고 최소 폭을 두지 않는다
const textSizeStyles = stylex.create({
  small: { minWidth: 0, paddingInline: '0.8rem' },
  medium: { minWidth: 0, paddingInline: '1rem' },
  large: { minWidth: 0, paddingInline: '1.2rem' },
});

const variantStyles = stylex.create({
  primary: {
    color: colorVars['--color-textInverse'],
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
      ':disabled': colorVars['--color-interactivePrimaryDisabled'],
    },
    borderColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
      ':disabled': colorVars['--color-interactivePrimaryDisabled'],
    },
  },
  secondary: {
    color: {
      default: colorVars['--color-textSecondary'],
      ':disabled': colorVars['--color-textDisabled'],
    },
    backgroundColor: {
      default: colorVars['--color-bgSurfaceSecondary'],
      ':hover': colorVars['--color-bgElevated'],
    },
    borderColor: colorVars['--color-bgSurfaceSecondary'],
  },
  outline: {
    color: {
      default: colorVars['--color-textInactive'],
      ':disabled': colorVars['--color-textDisabled'],
    },
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    borderColor: colorVars['--color-borderSubtle'],
  },
  outlinePrimary: {
    color: {
      default: colorVars['--color-interactivePrimary'],
      ':disabled': colorVars['--color-interactivePrimaryDisabled'],
    },
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    borderColor: {
      default: colorVars['--color-interactivePrimary'],
      ':disabled': colorVars['--color-interactivePrimaryDisabled'],
    },
  },
  text: {
    color: {
      default: colorVars['--color-textPrimary'],
      ':disabled': colorVars['--color-textDisabled'],
    },
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-fillSubtle'],
      ':active': colorVars['--color-fillSubtle'],
      ':disabled': 'transparent',
    },
    borderColor: 'transparent',
  },
});

const SIZE = {
  small: { box: sizeStyles.small, text: typographyStyles.body4Medium },
  medium: { box: sizeStyles.medium, text: typographyStyles.title5Medium },
  large: { box: sizeStyles.large, text: typographyStyles.title4Medium },
} as const satisfies Record<ButtonSize, unknown>;

/**
 * 액션을 실행하는 버튼. woolbank 의 폼 제출·하단 고정 버튼을 공용화한 것이다.
 *
 * - 네이티브 `<button>` 속성을 그대로 받는다. 폼 안에서 제출로 쓰려면 `type='submit'` 을 명시한다
 *   (HTML 기본값이 submit 이므로 의도와 다르게 폼이 제출되지 않도록 평소에는 `type='button'` 을 권한다).
 * - `loading` 중에는 `aria-busy` 와 `disabled` 가 함께 걸린다.
 * @component
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      fill = false,
      loading = false,
      disabled = false,
      startIcon,
      endIcon,
      xstyle,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const sx = stylex.props(
      styles.base,
      SIZE[size].box,
      SIZE[size].text,
      variantStyles[variant],
      variant === 'text' && textSizeStyles[size],
      fill && styles.fill,
      xstyle,
    );

    return (
      <button
        ref={ref}
        {...rest}
        {...sx}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
      >
        {startIcon && <span {...stylex.props(styles.iconSlot, loading && styles.contentHidden)}>{startIcon}</span>}
        <span {...stylex.props(loading && styles.contentHidden)}>{children}</span>
        {endIcon && <span {...stylex.props(styles.iconSlot, loading && styles.contentHidden)}>{endIcon}</span>}
        {loading && (
          <span aria-hidden='true' {...stylex.props(styles.spinnerWrap)}>
            <span {...stylex.props(styles.spinner)} />
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
