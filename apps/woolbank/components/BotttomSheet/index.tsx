'use client';

import { ComponentProps, FC } from 'react';
import AmountSheet from './AmountSheet';
import DateSheet from './DateSheet';
import DateTimeSheet from './DateTimeSheet';
import DefaultBottomSheet from './DefaultBottomSheet';
import MenuSheet from './MenuSheet';
import SnapSheet from './SnapSheet';

const BotttomSheet: FC<ComponentProps<typeof DefaultBottomSheet>> = ({ ...rest }) => {
  return <DefaultBottomSheet {...rest} />;
};

export default Object.assign(BotttomSheet, {
  Date: DateSheet,
  DateTime: DateTimeSheet,
  Menu: MenuSheet,
  Snap: SnapSheet,
  Amount: AmountSheet,
});
