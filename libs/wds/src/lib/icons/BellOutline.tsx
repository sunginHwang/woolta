import { createIcon } from './createIcon';

/** 알림(종). 읽지 않은 알림은 호출부가 Badge dot 을 얹는다 */
export const IconBellOutline = createIcon({
  name: 'IconBellOutline',
  render: (color) => (
    <g fill='none' stroke={color} strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z' />
      <path d='M10 20.5a2 2 0 0 0 4 0' />
    </g>
  ),
});
