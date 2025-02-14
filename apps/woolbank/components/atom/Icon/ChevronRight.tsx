import { FC } from 'react';
import { IconProps } from '.';

export const IconChevronRight: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} fill='none' viewBox='0 0 24 24'>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M14.94 12 7.47 4.53l1.06-1.06L17.06 12l-8.53 8.53-1.06-1.06L14.94 12Z'
        clipRule='evenodd'
      />
    </svg>
  );
};
