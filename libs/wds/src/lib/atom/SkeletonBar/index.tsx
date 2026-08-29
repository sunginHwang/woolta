'use client';

import * as stylex from '@stylexjs/stylex';
import type { FC, HTMLAttributes } from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  radius?: number;
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

export const SkeletonBar: FC<Props> = ({ width = '20rem', height = '3.2rem', radius = 3, className, ...rest }) => {
  const sx = stylex.props(styles.base, dynamicStyles.size(width, height, radius));

  return <div {...rest} {...sx} className={className ? `${sx.className ?? ''} ${className}` : sx.className} />;
};
