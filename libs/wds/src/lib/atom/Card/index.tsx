'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ElementType, HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { colorVars, shadowVars } from '../../style/tokens.stylex';

/** 안쪽 여백 none 0 / small 12 / medium 20 */
export type CardPadding = 'none' | 'small' | 'medium';

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, 'onClick'> {
  /**
   * 렌더링할 요소 타입
   * @default 'section'
   */
  as?: ElementType;
  /**
   * 안쪽 여백
   * @default 'medium'
   */
  padding?: CardPadding;
  /**
   * 좌우 20px 바깥 여백 (목록 안에서 화면 가장자리와 띄울 때)
   * @default false
   */
  inset?: boolean;
  /** 주면 카드 전체가 눌리는 버튼이 된다 (role=button, Enter/Space) */
  onClick?: () => void;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const styles = stylex.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: shadowVars['--shadow-card'],
    color: colorVars['--color-textPrimary'],
  },
  inset: { marginInline: '2rem' },
  interactive: {
    width: '100%',
    textAlign: 'left',
    borderWidth: 0,
    borderStyle: 'none',
    cursor: 'pointer',
    transitionProperty: 'background-color, opacity',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
    opacity: {
      default: 1,
      ':active': 0.7,
    },
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
});

const paddingStyles = stylex.create({
  none: { padding: 0 },
  small: { padding: '1.2rem' },
  medium: { padding: '2rem' },
});

/**
 * 내용을 한 덩어리로 묶는 표면. 목록 항목·요약 패널에 쓴다.
 * (woolbank CardItem 을 공용화한 것)
 * @component
 */
export const Card = ({
  as,
  padding = 'medium',
  inset = false,
  onClick,
  xstyle,
  className,
  children,
  ...rest
}: CardProps) => {
  const interactive = typeof onClick === 'function';
  const Tag: ElementType = as ?? (interactive ? 'button' : 'section');
  const isNativeButton = Tag === 'button';

  const sx = stylex.props(
    styles.base,
    paddingStyles[padding],
    inset && styles.inset,
    interactive && styles.interactive,
    xstyle,
  );

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (isNativeButton || !interactive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Tag
      {...rest}
      {...sx}
      className={className ? `${sx.className ?? ''} ${className}` : sx.className}
      {...(interactive && !isNativeButton ? { role: 'button', tabIndex: 0, onKeyDown } : {})}
      {...(isNativeButton ? { type: 'button' } : {})}
      onClick={interactive ? onClick : undefined}
    >
      {children}
    </Tag>
  );
};
