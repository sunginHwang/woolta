import { FC } from 'react';
import { IconProps } from '.';

export const IconCalendar: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg width={width} height={height} fill='none' viewBox='0 0 24 24'>
      <path
        fill={fill}
        fillRule='evenodd'
        d='M8.75 2v2h6.5V2h1.5v2H22v18H2V4h5.25V2h1.5Zm6.5 3.5V8h1.5V5.5h3.75v4.75h-17V5.5h3.75V8h1.5V5.5h6.5ZM3.5 11.75v8.75h17v-8.75h-17Z'
        clipRule='evenodd'
      />
    </svg>
  );
};
