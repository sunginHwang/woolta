import { FC } from 'react';
import { IconProps } from '.';

export const IconEditRegular: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg width={width} height={height} viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M27.0962 9.53565L22.5 4.93945L11.4337 16.0057L11.5092 20.5265L16.0299 20.6019L27.0962 9.53565ZM12.9441 16.6166L22.5 7.06077L24.9749 9.53565L15.419 19.0915L12.9847 19.0509L12.9441 16.6166Z'
        fill={fill}
      />
      <path d='M16 6.25012H6.25V25.7501H25.75V16.0001H24.25V24.2501H7.75V7.75012H16V6.25012Z' fill={fill} />
    </svg>
  );
};
