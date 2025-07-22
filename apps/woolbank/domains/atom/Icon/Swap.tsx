import { FC } from 'react';
import { IconProps } from '.';

export const IconSwap: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} fill='none' viewBox='0 0 24 24'>
      <path
        fill={fill}
        fillRule='evenodd'
        d='m7.406 11.122-.53-.53-2.418-2.418h-.165v-.165l-.073-.073-.53-.53.53-.53.073-.074v-.128h.128L6.875 4.22l.53-.53 1.061 1.06-.53.53-1.394 1.394h10a4.25 4.25 0 0 1 4.25 4.25v.79h-1.5v-.79a2.75 2.75 0 0 0-2.75-2.75H6.58L7.936 9.53l.53.53-1.06 1.06ZM20.5 18.255h-.128l-2.454 2.454-.53.53-1.061-1.06.53-.53 1.394-1.394h-10A4.25 4.25 0 0 1 4 14.005v-.79h1.5v.79a2.75 2.75 0 0 0 2.75 2.75H18.213l-1.357-1.357-.53-.53 1.06-1.061.53.53 2.418 2.418h.165v.165l.073.073.53.53-.53.53-.073.073v.129Z'
        clipRule='evenodd'
      />
    </svg>
  );
};
