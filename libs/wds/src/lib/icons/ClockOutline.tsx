import { createIcon } from './createIcon';

/** 시계. 곧 빠져나갈 이체·예정 시각 */
export const IconClockOutline = createIcon({
  name: 'IconClockOutline',
  render: (color) => (
    <g fill='none' stroke={color} strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 7v5l3 2' />
    </g>
  ),
});
