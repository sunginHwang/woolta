import { createIcon } from './createIcon';

export const IconChevronRight = createIcon({
  name: 'IconChevronRight',
  render: (color) => (
    <path
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
      d='M14.94 12 7.47 4.53l1.06-1.06L17.06 12l-8.53 8.53-1.06-1.06L14.94 12Z'
    />
  ),
});
