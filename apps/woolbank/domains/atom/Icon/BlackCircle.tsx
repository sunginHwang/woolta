import { FC } from 'react';
import { IconProps } from '.';

const BlackCircle: FC<IconProps> = ({ width = 24, height = 24, fill = 'currentColor' }) => {
  return (
    <svg version='1.1' width={width} height={height} viewBox='0 0 24 24'>
      <path
        fill={fill}
        d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
      />
    </svg>
  );
};

export default BlackCircle;
