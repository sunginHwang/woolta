import { FC } from 'react';
import { IconProps } from '.';

const Plus: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
      <path fill={fill} d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />
    </svg>
  );
};

export default Plus;
