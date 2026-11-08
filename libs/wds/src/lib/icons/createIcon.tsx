'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { FC, ReactNode, SVGProps } from 'react';

/** 모든 wds 아이콘이 공유하는 props */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'width' | 'height' | 'color' | 'fill'> {
  /**
   * 한 변의 길이. 숫자는 px
   * @default 24
   */
  size?: number | string;
  /**
   * 채움색. 기본은 글자색을 따른다
   * @default 'currentColor'
   */
  color?: string;
  /** 접근성 이름. 주면 role=img + <title>, 없으면 장식용(aria-hidden) */
  title?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 항상 마지막에 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  base: {
    display: 'inline-block',
    flexShrink: 0,
    verticalAlign: 'middle',
  },
});

interface IconDefinition {
  /** displayName 과 갤러리에 쓰는 export 이름 (예: IconChevronLeft) */
  name: string;
  /** @default '0 0 24 24' */
  viewBox?: string;
  /** color 를 받아 path 들을 그린다. 브랜드 아이콘은 color 를 무시해도 된다 */
  render: (color: string) => ReactNode;
}

/**
 * 아이콘 팩토리. svg 래퍼·크기·접근성 처리를 한곳에 두고 각 아이콘 파일은 path 만 갖는다.
 */
export const createIcon = ({ name, viewBox = '0 0 24 24', render }: IconDefinition): FC<IconProps> => {
  const Icon: FC<IconProps> = ({ size = 24, color = 'currentColor', title, className, xstyle, ...svgProps }) => {
    const sx = stylex.props(styles.base, xstyle);
    const a11y = title ? { role: 'img' } : { 'aria-hidden': true };

    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        xmlns='http://www.w3.org/2000/svg'
        {...a11y}
        {...svgProps}
        {...sx}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
      >
        {title && <title>{title}</title>}
        {render(color)}
      </svg>
    );
  };

  Icon.displayName = name;

  return Icon;
};
