import { FC } from 'react';
import { IconProps } from '.';

const WalletOutline: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
      <path fill='none' d='M0 0h24v24H0V0z' />
      <g>
        <path
          fill={fill}
          d='M21 7.28V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-2.28c.59-.35 1-.98 1-1.72V9c0-.74-.41-1.37-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z'
        />
        <circle fill={fill} cx='16' cy='12' r='1.5' />
      </g>
    </svg>
  );
};

export default WalletOutline;
