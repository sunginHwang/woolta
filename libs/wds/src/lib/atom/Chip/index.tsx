'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import { forwardRef } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/**
 * - solid: 회색 채움 알약. woolbank 필터 행의 기본 모양
 * - outlineStrong: 뚜렷한 테두리. 주변과 명확히 구분해야 할 때
 * - outlineWeak: 옅은 테두리. 여러 개 중 고르는 선택(selection) 용도에 권장 (SEED)
 */
export type ChipVariant = 'solid' | 'outlineStrong' | 'outlineWeak';

/** 높이 small 32 / medium 36 / large 40 */
export type ChipSize = 'small' | 'medium' | 'large';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** 라벨 텍스트. 제거 버튼의 접근성 이름("{label} 삭제")에도 쓰인다 */
  label: string;
  /**
   * 스타일 변형
   * @default 'solid'
   */
  variant?: ChipVariant;
  /**
   * 크기 (높이 32 / 36 / 40px)
   * @default 'medium'
   */
  size?: ChipSize;
  /**
   * 선택 상태. 값을 주면 토글 버튼(aria-pressed)으로 동작한다.
   * solid 는 배경이 반전되고, outline 계열은 테두리가 진해지며 옅은 배경이 깔린다
   */
  selected?: boolean;
  /** 라벨 왼쪽 아이콘 (16px, currentColor) */
  prefixIcon?: ReactNode;
  /** 라벨 오른쪽 아이콘 (16px, currentColor). onRemove 가 있으면 그 앞에 놓인다 */
  suffixIcon?: ReactNode;
  /**
   * 주면 ✕ 제거 버튼이 붙는다 — 입력한 값을 칩으로 쌓는 input chip 용도.
   * ✕ 클릭은 칩 자체의 onClick 으로 전파되지 않는다
   */
  onRemove?: () => void;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지되어 오버라이드 가능하다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    minWidth: '4.4rem',
    boxSizing: 'border-box',
    flexShrink: 0,
    whiteSpace: 'nowrap',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    scrollSnapAlign: 'start',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    opacity: {
      default: 1,
      ':disabled': 0.5,
    },
    transform: {
      default: 'scale(1)',
      ':active': 'scale(0.97)',
    },
    transitionProperty: 'background-color, color, border-color, transform',
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
  iconSlot: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.6rem',
    height: '1.6rem',
    flexShrink: 0,
  },
  // 칩 안의 제거 버튼. 칩이 <button> 이라 중첩 버튼을 피해 span[role=button] 으로 둔다
  remove: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.6rem',
    height: '1.6rem',
    marginRight: '-0.4rem',
    borderRadius: '50%',
    color: 'inherit',
    opacity: {
      default: 0.6,
      ':hover': 1,
    },
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.1rem',
  },
});

const sizeStyles = stylex.create({
  small: { height: '3.2rem', paddingInline: '1.2rem' },
  medium: { height: '3.6rem', paddingInline: '1.6rem' },
  large: { height: '4rem', paddingInline: '2rem' },
});

const variantStyles = stylex.create({
  solid: {
    color: colorVars['--color-textPrimary'],
    backgroundColor: {
      default: colorVars['--color-bgSurfaceSecondary'],
      ':hover': colorVars['--color-bgElevated'],
    },
    borderColor: colorVars['--color-bgSurfaceSecondary'],
  },
  solidSelected: {
    color: colorVars['--color-textInverse'],
    backgroundColor: {
      default: colorVars['--color-bgInverse'],
      ':hover': colorVars['--color-bgInverse'],
    },
    borderColor: colorVars['--color-bgInverse'],
  },
  outlineStrong: {
    color: colorVars['--color-textPrimary'],
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    borderColor: colorVars['--color-borderDefault'],
  },
  outlineWeak: {
    color: colorVars['--color-textSecondary'],
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    borderColor: colorVars['--color-borderSubtle'],
  },
  outlineSelected: {
    color: colorVars['--color-interactivePrimaryText'],
    backgroundColor: {
      default: colorVars['--color-interactivePrimarySubtle'],
      ':hover': colorVars['--color-interactivePrimarySubtle'],
    },
    borderColor: colorVars['--color-interactivePrimary'],
    fontWeight: 600,
  },
});

const SIZE = {
  small: { box: sizeStyles.small, text: typographyStyles.body4Medium },
  medium: { box: sizeStyles.medium, text: typographyStyles.body4Medium },
  large: { box: sizeStyles.large, text: typographyStyles.body3 },
} as const satisfies Record<ChipSize, unknown>;

const RemoveIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden='true'>
    <path d='M3 3l6 6M9 3l-6 6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
  </svg>
);

/**
 * 사용자가 고르거나 입력한 값을 짧은 알약 모양으로 보여주는 컴포넌트.
 * woolbank 통계 화면의 필터 행("2026년 11월 · 지출 · 카테고리 통계 필터 적용")이 대표 사용처다.
 *
 * - 여러 개를 나란히 둘 때는 `ChipGroup` 으로 감싼다.
 * - 화면 전환(탭) 용도로는 쓰지 않는다 — 그건 Tabs 의 chip variant 몫이다 (SEED 기준).
 * @component
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      label,
      variant = 'solid',
      size = 'medium',
      selected,
      prefixIcon,
      suffixIcon,
      onRemove,
      disabled = false,
      xstyle,
      className,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    const selectedStyle = selected
      ? variant === 'solid'
        ? variantStyles.solidSelected
        : variantStyles.outlineSelected
      : null;

    const sx = stylex.props(
      styles.base,
      SIZE[size].box,
      SIZE[size].text,
      variantStyles[variant],
      selectedStyle,
      xstyle,
    );

    const handleRemove = (event: MouseEvent<HTMLSpanElement>) => {
      event.stopPropagation();
      if (disabled) return;
      onRemove?.();
    };

    return (
      <button
        ref={ref}
        type={type}
        {...rest}
        {...sx}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
        disabled={disabled}
        aria-pressed={selected === undefined ? undefined : selected}
      >
        {prefixIcon && <span {...stylex.props(styles.iconSlot)}>{prefixIcon}</span>}
        <span>{label}</span>
        {suffixIcon && <span {...stylex.props(styles.iconSlot)}>{suffixIcon}</span>}
        {onRemove && (
          // biome-ignore lint/a11y/useSemanticElements: 칩 자체가 <button> 이라 중첩 버튼(invalid HTML)을 피해 span 으로 둔다
          <span
            role='button'
            tabIndex={disabled ? -1 : 0}
            aria-label={`${label} 삭제`}
            aria-disabled={disabled || undefined}
            onClick={handleRemove}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                event.stopPropagation();
                if (!disabled) onRemove();
              }
            }}
            {...stylex.props(styles.remove)}
          >
            <RemoveIcon />
          </span>
        )}
      </button>
    );
  },
);

Chip.displayName = 'Chip';

export interface ChipGroupProps {
  /**
   * scroll: 한 줄로 두고 가로 스크롤 (woolbank 필터 행). wrap: 줄바꿈해 전부 보인다
   * @default 'scroll'
   */
  layout?: 'scroll' | 'wrap';
  /**
   * 칩 사이 간격 (px)
   * @default 8
   */
  gap?: number;
  /** 접근성 이름. 필터 행처럼 묶음의 의미가 있을 때 준다 */
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지되어 오버라이드 가능하다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const groupStyles = stylex.create({
  base: {
    display: 'flex',
    alignItems: 'center',
  },
  scroll: {
    flexWrap: 'nowrap',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollSnapType: 'x proximity',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
    // 끝까지 스크롤했을 때 마지막 칩이 잘리지 않게 여유를 둔다
    scrollPaddingInline: '0.4rem',
  },
  wrap: {
    flexWrap: 'wrap',
  },
});

const groupDynamic = stylex.create({
  gap: (gap: string) => ({ gap }),
});

/**
 * Chip 여러 개를 한 묶음으로 배치한다.
 * SEED 의 Chip Group 템플릿에 해당하며, Scrollable(한 줄) / Overflow(전체 표시) 두 레이아웃을 제공한다.
 * @component
 */
export const ChipGroup = ({
  layout = 'scroll',
  gap = 8,
  'aria-label': ariaLabel,
  xstyle,
  children,
}: ChipGroupProps) => (
  // biome-ignore lint/a11y/useSemanticElements: fieldset 은 기본 테두리·여백과 flex 버그가 있어 div[role=group] 으로 둔다
  <div
    role='group'
    aria-label={ariaLabel}
    {...stylex.props(groupStyles.base, groupStyles[layout], groupDynamic.gap(`${gap}px`), xstyle)}
  >
    {children}
  </div>
);
