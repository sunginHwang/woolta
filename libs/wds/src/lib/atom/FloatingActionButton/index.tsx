'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { IconPlus } from '../../icons';
import { colorVars, shadowVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export type FloatingActionButtonSize = 'medium' | 'large';

export interface FloatingActionButtonProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** 접근성 이름. extended 면 화면에도 표시된다 */
  label: string;
  /**
   * 버튼 안 아이콘
   * @default <IconPlus />
   */
  icon?: ReactNode;
  /**
   * 지름 medium 48px / large 56px (SEED FAB 기본 56)
   * @default 'large'
   */
  size?: FloatingActionButtonSize;
  /**
   * true 면 아이콘 옆에 라벨을 보이는 알약 형태
   * @default false
   */
  extended?: boolean;
  /** 주면 링크로 렌더된다 (woolbank AddButton 이 가계부 작성 페이지로 이동하던 방식) */
  href?: string;
  /**
   * href 가 있을 때 쓰는 링크 컴포넌트. Next 라면 Link 를 넘긴다
   * @default 'a'
   */
  linkComponent?: ElementType;
  /**
   * fixed 는 우하단 고정(BottomNavigation 위). static 은 흐름 안에 둔다(스토리·임베드)
   * @default 'fixed'
   */
  position?: 'fixed' | 'static';
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    boxSizing: 'border-box',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '9999px',
    color: colorVars['--color-textInverse'],
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    boxShadow: shadowVars['--shadow-popover'],
    cursor: 'pointer',
    textDecoration: 'none',
    transform: {
      default: 'scale(1)',
      ':active': 'scale(0.92)',
    },
    transitionProperty: 'transform, background-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  fixed: {
    position: 'fixed',
    right: '2rem',
    // BottomNavigation(56px + safe-area) 위에 뜨도록 여유를 둔다
    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8rem)',
    zIndex: zIndexConsts.floatButton,
  },
  static: { position: 'static' },
  medium: { width: '4.8rem', height: '4.8rem' },
  large: { width: '5.6rem', height: '5.6rem' },
  extendedMedium: { width: 'auto', height: '4.8rem', paddingInline: '1.6rem' },
  extendedLarge: { width: 'auto', height: '5.6rem', paddingInline: '2rem' },
  iconSlot: { display: 'inline-flex', flexShrink: 0 },
  labelText: { whiteSpace: 'nowrap' },
});

const SIZE = {
  medium: { circle: styles.medium, extended: styles.extendedMedium },
  large: { circle: styles.large, extended: styles.extendedLarge },
} as const satisfies Record<FloatingActionButtonSize, unknown>;

/**
 * 화면 우하단에 떠 있는 주 액션 버튼. woolbank 의 '+'(가계부 추가) 버튼을 공용화한 것이다.
 * 화면당 하나만 두고, 목록에 항목을 추가하는 것처럼 가장 자주 쓰는 액션에만 쓴다.
 * @component
 */
export const FloatingActionButton = ({
  label,
  icon = <IconPlus />,
  size = 'large',
  extended = false,
  href,
  linkComponent: LinkComponent = 'a',
  position = 'fixed',
  xstyle,
  className,
  ...rest
}: FloatingActionButtonProps) => {
  const sx = stylex.props(
    styles.base,
    position === 'fixed' ? styles.fixed : styles.static,
    extended ? SIZE[size].extended : SIZE[size].circle,
    xstyle,
  );
  const mergedClassName = className ? `${sx.className ?? ''} ${className}` : sx.className;
  const content = (
    <>
      <span {...stylex.props(styles.iconSlot)}>{icon}</span>
      {extended && <span {...stylex.props(typographyStyles.title6Bold, styles.labelText)}>{label}</span>}
    </>
  );

  if (href) {
    return (
      <LinkComponent href={href} aria-label={label} {...rest} {...sx} className={mergedClassName}>
        {content}
      </LinkComponent>
    );
  }

  return (
    <button type='button' aria-label={label} {...rest} {...sx} className={mergedClassName}>
      {content}
    </button>
  );
};
