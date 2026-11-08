import { createIcon } from './createIcon';

export const IconChartFill = createIcon({
  name: 'IconChartFill',
  render: (color) => <path fill={color} d='M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z' />,
});
