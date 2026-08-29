'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  radius?: number;
  /** 외부에서 StyleX 스타일을 주입한다 (wds 공통 컨벤션) */
  xstyle?: StyleXStyles;
}

const loading = stylex.keyframes({
  '0%': { backgroundColor: 'hsl(0, 0%, 89%)' },
  '50%': { backgroundColor: 'hsl(0, 0%, 85%)' },
  '100%': { backgroundColor: 'hsl(0, 0%, 89%)' },
});

const styles = stylex.create({
  base: {
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
