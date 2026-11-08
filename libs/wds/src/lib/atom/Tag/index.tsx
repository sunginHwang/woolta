'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export type TagTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'info';

/** subtle = 12% 틴트 배경(기본), solid = 채움, outline = 테두리 */
export type TagVariant = 'solid' | 'subtle' | 'outline';

/** 높이 18 / 22px */
export type TagSize = 'small' | 'medium';

export interface TagProps extends HTMLAttributes<HTMLElement> {
  /**
   * 색 역할. 상태(success/warning/error/info)는 status 토큰, brand 는 브랜드 핑크
   * @default 'neutral'
   */
  tone?: TagTone;
  /**
   * 배경 처리
   * @default 'subtle'
   */
  variant?: TagVariant;
  /**
   * 높이 (small 18 / medium 22px)
   * @default 'small'
   */
  size?: TagSize;
  /** 텍스트 앞 아이콘 (12px, currentColor) */
  icon?: ReactNode;
  /**
   * 렌더링 요소. 목록 안에서는 li
   * @default 'span'
   */
  as?: 'span' | 'li';
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    boxSizing: 'border-box',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
  },
  icon: {
    display: 'inline-flex',
    width: '1.2rem',
    height: '1.2rem',
    flexShrink: 0,
  },
});

const sizeStyles = stylex.create({
  small: { height: '1.8rem', paddingInline: '0.8rem' },
  medium: { height: '2.2rem', paddingInline: '1rem' },
});

const tint = (token: string) => `color-mix(in srgb, ${token} 12%, transparent)`;

/** tone 별 (강조색, 틴트 배경) — subtle/outline 은 글자색으로, solid 는 배경으로 쓴다 */
const toneStyles = stylex.create({
  neutralSubtle: {
    color: colorVars['--color-textSecondary'],
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
  },
  neutralSolid: { color: colorVars['--color-textInverse'], backgroundColor: colorVars['--color-bgInverse'] },
  neutralOutline: { color: colorVars['--color-textSecondary'], borderColor: colorVars['--color-borderDefault'] },

  brandSubtle: { color: colorVars['--color-brandPrimary'], backgroundColor: tint(colorVars['--color-brandPrimary']) },
  brandSolid: { color: colorVars['--color-textInverse'], backgroundColor: colorVars['--color-brandPrimary'] },
  brandOutline: { color: colorVars['--color-brandPrimary'], borderColor: colorVars['--color-brandPrimary'] },

  successSubtle: {
    color: colorVars['--color-statusSuccess'],
    backgroundColor: tint(colorVars['--color-statusSuccess']),
  },
  successSolid: { color: colorVars['--color-textInverse'], backgroundColor: colorVars['--color-statusSuccess'] },
  successOutline: { color: colorVars['--color-statusSuccess'], borderColor: colorVars['--color-statusSuccess'] },

  warningSubtle: {
    color: colorVars['--color-statusWarning'],
    backgroundColor: tint(colorVars['--color-statusWarning']),
  },
  warningSolid: { color: colorVars['--color-textActive'], backgroundColor: colorVars['--color-statusWarning'] },
  warningOutline: { color: colorVars['--color-statusWarning'], borderColor: colorVars['--color-statusWarning'] },

  errorSubtle: { color: colorVars['--color-statusError'], backgroundColor: tint(colorVars['--color-statusError']) },
  errorSolid: { color: colorVars['--color-textInverse'], backgroundColor: colorVars['--color-statusError'] },
  errorOutline: { color: colorVars['--color-statusError'], borderColor: colorVars['--color-statusError'] },

  infoSubtle: { color: colorVars['--color-statusInfo'], backgroundColor: tint(colorVars['--color-statusInfo']) },
  infoSolid: { color: colorVars['--color-textInverse'], backgroundColor: colorVars['--color-statusInfo'] },
  infoOutline: { color: colorVars['--color-statusInfo'], borderColor: colorVars['--color-statusInfo'] },
});

const TONE = {
  neutral: { subtle: toneStyles.neutralSubtle, solid: toneStyles.neutralSolid, outline: toneStyles.neutralOutline },
  brand: { subtle: toneStyles.brandSubtle, solid: toneStyles.brandSolid, outline: toneStyles.brandOutline },
  success: { subtle: toneStyles.successSubtle, solid: toneStyles.successSolid, outline: toneStyles.successOutline },
  warning: { subtle: toneStyles.warningSubtle, solid: toneStyles.warningSolid, outline: toneStyles.warningOutline },
  error: { subtle: toneStyles.errorSubtle, solid: toneStyles.errorSolid, outline: toneStyles.errorOutline },
  info: { subtle: toneStyles.infoSubtle, solid: toneStyles.infoSolid, outline: toneStyles.infoOutline },
} as const satisfies Record<TagTone, Record<TagVariant, unknown>>;

const SIZE = {
  small: { box: sizeStyles.small, text: typographyStyles.small4Medium },
  medium: { box: sizeStyles.medium, text: typographyStyles.small2Medium },
} as const satisfies Record<TagSize, unknown>;

/**
 * 상태·분류를 알리는 정적 라벨 ('정기이체', '중복 의심 3건').
 * 누를 수 없다 — 선택·필터처럼 누르는 것은 Chip 을 쓴다.
 * @component
 */
export const Tag = ({
  tone = 'neutral',
  variant = 'subtle',
  size = 'small',
  icon,
  as: Component = 'span',
  xstyle,
  className,
  children,
  ...rest
}: TagProps) => {
  const sx = stylex.props(styles.root, SIZE[size].box, SIZE[size].text, TONE[tone][variant], xstyle);

  return (
    <Component {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      {icon && (
        <span aria-hidden='true' {...stylex.props(styles.icon)}>
          {icon}
        </span>
      )}
      {children}
    </Component>
  );
};
