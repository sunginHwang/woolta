import { FC } from 'react';
import { IconProps } from '.';

const ChevronDown: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
      <path fill={fill} d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
    </svg>
  );
};

export default ChevronDown;
