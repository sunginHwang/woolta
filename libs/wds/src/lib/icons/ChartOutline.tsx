import { createIcon } from './createIcon';

/** 통계(파이 차트) Outline. 활성 탭은 IconChartFill */
export const IconChartOutline = createIcon({
  name: 'IconChartOutline',
  render: (color) => (
    <g fill='none' stroke={color} strokeWidth='1.75' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M11 3.5A8.5 8.5 0 1 0 20.5 13H11V3.5Z' />
      <path d='M14.5 2.8a8.5 8.5 0 0 1 6.7 6.7h-6.7V2.8Z' />
    </g>
  ),
});
