'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { FC, HTMLAttributes } from 'react';
import { colorVars } from '../../style/tokens.stylex';

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  radius?: number;
  /** 외부에서 StyleX 스타일을 주입한다 (wds 공통 컨벤션) */
  xstyle?: StyleXStyles;
}

// 색이 아니라 투명도를 흔든다 — 배경색은 토큰(fillMuted)이라 다크에서도 어두운 회색으로 따라간다
const loading = stylex.keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.55 },
  '100%': { opacity: 1 },
});

const styles = stylex.create({
  base: {
    backgroundColor: colorVars['--color-fillMuted'],
    animationName: loading,
    animationDuration: '1.3s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'ease-in-out',
  },
});

const dynamicStyles = stylex.create({
  size: (width: string, height: string, radius: number) => ({
    width,
    height,
    borderRadius: `${radius}px`,
  }),
});

export const SkeletonBar: FC<Props> = ({
  width = '20rem',
  height = '3.2rem',
  radius = 3,
  className,
  xstyle,
  ...rest
}) => {
  const sx = stylex.props(styles.base, dynamicStyles.size(width, height, radius), xstyle);

  return <div {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className} />;
};
