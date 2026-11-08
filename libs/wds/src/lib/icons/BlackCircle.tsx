import { createIcon } from './createIcon';

export const IconBlackCircle = createIcon({
  name: 'IconBlackCircle',
  render: (color) => (
    <path
      fill={color}
      d='M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
    />
  ),
});
