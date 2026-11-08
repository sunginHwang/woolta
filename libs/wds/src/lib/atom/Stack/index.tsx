'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, ElementType, HTMLAttributes } from 'react';
import { forwardRef } from 'react';

/**
 * Stack 의 props. 레이아웃 전용이라 색상·글꼴 토큰은 받지 않는다.
 * 길이 값(gap·width·margin·padding)에 숫자를 주면 px 로 해석한다. `flex` 만 단위 없는 숫자 그대로다.
 */
export interface StackProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * 렌더링할 요소 타입
   * @default 'div'
   */
  as?: ElementType;
  /** true 면 inline-flex 로 흐름 안에 배치한다 */
  inline?: boolean;
  /** flex-direction */
  direction?: CSSProperties['flexDirection'];
  /** flex-wrap */
  wrap?: CSSProperties['flexWrap'];
  /** align-items (교차축 정렬) */
  align?: CSSProperties['alignItems'];
  /** justify-content (주축 정렬) */
  justify?: CSSProperties['justifyContent'];
  /** 부모 flex 컨테이너 안에서의 flex 값 (예: 1, '0 0 auto') */
  flex?: CSSProperties['flex'];
  /** 자식 사이 간격. 숫자는 px */
  gap?: CSSProperties['gap'];
  /** width. 숫자는 px */
  width?: CSSProperties['width'];
  /** height. 숫자는 px */
  height?: CSSProperties['height'];
  /** margin. 숫자는 px */
  m?: CSSProperties['margin'];
  /** margin-top. 숫자는 px */
  mt?: CSSProperties['marginTop'];
  /** margin-left. 숫자는 px */
  ml?: CSSProperties['marginLeft'];
  /** margin-right. 숫자는 px */
  mr?: CSSProperties['marginRight'];
  /** margin-bottom. 숫자는 px */
  mb?: CSSProperties['marginBottom'];
  /** padding. 숫자는 px */
  p?: CSSProperties['padding'];
  /** padding-top. 숫자는 px */
  pt?: CSSProperties['paddingTop'];
  /** padding-left. 숫자는 px */
  pl?: CSSProperties['paddingLeft'];
  /** padding-right. 숫자는 px */
  pr?: CSSProperties['paddingRight'];
  /** padding-bottom. 숫자는 px */
  pb?: CSSProperties['paddingBottom'];
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지되어 오버라이드 가능하다 */
  xstyle?: StyleXStyles;
  children?: React.ReactNode;
}

const styles = stylex.create({
  flex: { display: 'flex' },
  inlineFlex: { display: 'inline-flex' },
});

// 값이 주어진 속성만 CSS 변수로 내보낸다 — 없는 속성은 브라우저 기본값을 그대로 둔다
const dynamic = stylex.create({
  direction: (value: string) => ({ flexDirection: value }),
  wrap: (value: string) => ({ flexWrap: value }),
  align: (value: string) => ({ alignItems: value }),
  justify: (value: string) => ({ justifyContent: value }),
  flex: (value: string) => ({ flex: value }),
  gap: (value: string) => ({ gap: value }),
  width: (value: string) => ({ width: value }),
  height: (value: string) => ({ height: value }),
  m: (value: string) => ({ margin: value }),
  mt: (value: string) => ({ marginTop: value }),
  ml: (value: string) => ({ marginLeft: value }),
  mr: (value: string) => ({ marginRight: value }),
  mb: (value: string) => ({ marginBottom: value }),
  p: (value: string) => ({ padding: value }),
  pt: (value: string) => ({ paddingTop: value }),
  pl: (value: string) => ({ paddingLeft: value }),
  pr: (value: string) => ({ paddingRight: value }),
  pb: (value: string) => ({ paddingBottom: value }),
});

type DynamicKey = keyof typeof dynamic;

/** 숫자는 px 로, 문자열은 그대로. undefined 면 스타일을 만들지 않는다 */
const length = (key: DynamicKey, value: string | number | undefined) =>
  value === undefined ? null : dynamic[key](typeof value === 'number' ? `${value}px` : value);

/** flex 는 단위 없는 숫자(flex: 1)가 정상 값이라 px 를 붙이지 않는다 */
const unitless = (key: DynamicKey, value: string | number | undefined) =>
  value === undefined ? null : dynamic[key](String(value));

/**
 * 자식을 flex 로 배치하는 레이아웃 프리미티브.
 * 방향·정렬·간격·여백을 prop 으로 받아 `display: flex` 래퍼 div 를 매번 만들지 않게 한다.
 * (@croquiscom/monolith 의 Stack 을 StyleX 로 옮긴 것)
 *
 * @example
 * ```tsx
 * // 가로 중앙 정렬, 8px 간격
 * <Stack align='center' gap={8}>…</Stack>
 *
 * // 세로 쌓기, 양 끝 정렬
 * <Stack direction='column' justify='space-between' height='100%'>…</Stack>
 * ```
 */
export const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      as: Tag = 'div',
      inline = false,
      direction,
      wrap,
      align,
      justify,
      flex,
      gap,
      width,
      height,
      m,
      mt,
      ml,
      mr,
      mb,
      p,
      pt,
      pl,
      pr,
      pb,
      xstyle,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const sx = stylex.props(
      inline ? styles.inlineFlex : styles.flex,
      unitless('direction', direction),
      unitless('wrap', wrap),
      unitless('align', align),
      unitless('justify', justify),
      unitless('flex', flex),
      length('gap', gap),
      length('width', width),
      length('height', height),
      length('m', m),
      length('mt', mt),
      length('ml', ml),
      length('mr', mr),
      length('mb', mb),
      length('p', p),
      length('pt', pt),
      length('pl', pl),
      length('pr', pr),
      length('pb', pb),
      xstyle,
    );

    return (
      <Tag
        ref={ref}
        {...rest}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
        // 동적 값은 CSS 변수(sx.style)로 나온다. 사용자가 준 style 이 마지막에 와서 이긴다
        style={style ? { ...sx.style, ...style } : sx.style}
      >
        {children}
      </Tag>
    );
  },
);

Stack.displayName = 'Stack';
