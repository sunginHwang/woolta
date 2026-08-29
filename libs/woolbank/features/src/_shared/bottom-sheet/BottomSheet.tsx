'use client';

import type { ComponentProps } from 'react';
import { AmountSheet } from './amount-sheet/AmountSheet';
import { DefaultBottomSheet } from './DefaultBottomSheet';
import { DateSheet } from './date-sheet/DateSheet';
import { DateTimeSheet } from './date-time-sheet/DateTimeSheet';
import { MenuSheet } from './menu-sheet/MenuSheet';
import { SnapSheet } from './snap-sheet/SnapSheet';

const _BottomSheet = ({ ...rest }: ComponentProps<typeof DefaultBottomSheet>) => {
  return <DefaultBottomSheet {...rest} />;
};

export const BottomSheet = Object.assign(_BottomSheet, {
  Date: DateSheet,
  DateTime: DateTimeSheet,
  Menu: MenuSheet,
  Snap: SnapSheet,
  Amount: AmountSheet,
});
