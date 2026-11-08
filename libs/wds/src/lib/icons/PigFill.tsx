import { createIcon } from './createIcon';

export const IconPigFill = createIcon({
  name: 'IconPigFill',
  render: (color) => (
    <path
      fill={color}
      fillRule='evenodd'
      clipRule='evenodd'
      d='M22 12H20C20 8.7 16.4 6 12 6C11.2 6 10.3 6.1 9.6 6.3L7 5V7.3C5.5 8.2 4.5 9.5 4.1 11H2V15H5.1C5.6 15.6 6.2 16.2 7 16.7V20H9V17.6C9.9 17.9 10.9 18 12 18S14.1 17.8 15 17.6V20H17V16.7C18.1 16 19 15.1 19.5 14H22V12M9 12C8.4 12 8 11.6 8 11S8.4 10 9 10 10 10.4 10 11 9.6 12 9 12Z'
    />
  ),
});
