import { createIcon } from './createIcon';

/** 테마(반달). 라이트/다크 전환 메뉴 */
export const IconThemeOutline = createIcon({
  name: 'IconThemeOutline',
  render: (color) => (
    <g fill='none' stroke={color} strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 3a9 9 0 1 0 0 18V3Z' fill={color} stroke='none' />
    </g>
  ),
});
