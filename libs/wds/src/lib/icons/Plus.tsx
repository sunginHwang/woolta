import { createIcon } from './createIcon';

export const IconPlus = createIcon({
  name: 'IconPlus',
  render: (color) => <path fill={color} d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' />,
});
