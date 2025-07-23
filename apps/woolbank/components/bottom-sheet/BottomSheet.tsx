'use client';

import { ComponentProps } from 'react';
import { AmountSheet } from './amount-sheet/AmountSheet';
import { DateSheet } from './date-sheet/DateSheet';
import { DateTimeSheet } from './date-time-sheet/DateTimeSheet';
import { DefaultBottomSheet } from './DefaultBottomSheet';
import { MenuSheet } from './menu-sheet/MenuSheet';
import { SnapSheet } from './snap-sheet/SnapSheet';

const _BotttomSheet = ({ ...rest }: ComponentProps<typeof DefaultBottomSheet>) => {
  return <DefaultBottomSheet {...rest} />;
};

export const BottomSheet = Object.assign(_BotttomSheet, {
  Date: DateSheet,
  DateTime: DateTimeSheet,
  Menu: MenuSheet,
  Snap: SnapSheet,
  Amount: AmountSheet,
});
