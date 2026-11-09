import { createIcon } from './createIcon';

/** 안내(i). 안내 박스·도움말 앞에 둔다 */
export const IconInfoCircle = createIcon({
  name: 'IconInfoCircle',
  render: (color) => (
    <g fill='none' stroke={color} strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 11v5M12 8h.01' />
    </g>
  ),
});
