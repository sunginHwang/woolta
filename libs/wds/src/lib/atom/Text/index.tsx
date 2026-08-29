'use client';

import * as stylex from '@stylexjs/stylex';
import type { StyleXStyles } from '@stylexjs/stylex';
import React, { FC, ReactNode } from 'react';
import { ColorType, FontVarient } from '../../style';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

type Alignment = 'left' | 'center' | 'right';

type TextElement = keyof Pick<
  React.JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span' | 'li' | 'label'
>;

export interface BaseTextProps {
  /**
   * text 위치를 설정 합니다.
   * @default 'left'
   */
  alignment?: Alignment;
  /**
   * text 컴포넌트 종류를 선택 합니다.
   * @default 'span'
   */
  as?: TextElement;
  /**
   * text 색상을 선택합니다.
   * @default 'black'
   */
  color?: ColorType;
  /**
   * text 타입을 정의 합니다.
   */
  variant: FontVarient;
  /**
   * margin-top 값을 정의합니다.(px 단위)
   * @default 0
   */
  mt?: number;
  /**
   * margin-right 값을 정의합니다.(px 단위)
   * @default 0
   */
  mr?: number;
  /**
   * margin-bottom 값을 정의합니다.(px 단위)
   * @default 0
   */
  mb?: number;
  /**
   * margin-left 값을 정의합니다.(px 단위)
   * @default 0
   */
  ml?: number;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지되어 오버라이드 가능하다 */
  xstyle?: StyleXStyles;
  children?: ReactNode;
}

const alignmentStyles = stylex.create({
  left: { textAlign: 'left' },
  center: { textAlign: 'center' },
  right: { textAlign: 'right' },
});

const dynamicStyles = stylex.create({
  color: (color: string) => ({ color }),
  margin: (mt: number, mr: number, mb: number, ml: number) => ({
    marginTop: `${mt}px`,
    marginRight: `${mr}px`,
    marginBottom: `${mb}px`,
    marginLeft: `${ml}px`,
  }),
});

const colorVarOf = (color: ColorType) => (colorVars as unknown as Record<string, string>)[`--color-${color}`];

/**
 * Text 컴포넌트
 * @component
 */
export const Text: FC<BaseTextProps & React.JSX.IntrinsicElements[NonNullable<BaseTextProps['as']>]> = ({
  as = 'span',
  alignment = 'left',
  mt = 0,
  mb = 0,
  ml = 0,
  mr = 0,
  color = 'black',
  variant,
  xstyle,
  children,
  className,
  onClick,
}) => {
  const Tag = as;
  const sx = stylex.props(
    typographyStyles[variant],
    alignmentStyles[alignment],
    dynamicStyles.color(colorVarOf(color)),
    dynamicStyles.margin(mt, mr, mb, ml),
    xstyle,
  );

  return (
    <Tag
      {...sx}
      className={className ? `${sx.className ?? ''} ${className}` : sx.className}
      onClick={onClick as React.MouseEventHandler<HTMLElement> | undefined}
    >
      {children}
    </Tag>
  );
};
