import { ComponentProps, FC } from 'react';
import DateSheet from './DateSheet';
import DefaultBottomSheet from './DefaultBottomSheet';
import MenuSheet from './MenuSheet';
import SnapSheet from './SnapSheet';

const BotttomSheet: FC<ComponentProps<typeof DefaultBottomSheet>> = ({ ...rest }) => {
  return <DefaultBottomSheet {...rest} />;
};

export default Object.assign(BotttomSheet, {
  Date: DateSheet,
  Menu: MenuSheet,
  Snap: SnapSheet,
});
