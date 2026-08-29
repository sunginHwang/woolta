'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import type { ReactNode } from 'react';

interface Props {
  days: string;
  totalAmount: number;
  children: ReactNode;
}

/**
 * 가계부 리스트 날짜 그룹
 * @component
 */
const DayGroup = ({ days, totalAmount, children }: Props) => {
  const isSavedAmount = totalAmount > 0;
  return (
    <div {...stylex.props(styles.dayGroup)}>
      <div {...stylex.props(styles.dayInfo)}>
        <Text variant='body3' color='textTertiary'>
          {days}일
        </Text>
        <Text variant='title5Medium' color={isSavedAmount ? 'statusError' : 'textPrimary'}>
          {totalAmount.toLocaleString('ko-KR')}원
        </Text>
      </div>
      {children}
    </div>
  );
};

export default DayGroup;

const styles = stylex.create({
  dayGroup: {},
  dayInfo: {
    paddingBottom: '1rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-borderSubtle'],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBlock: '1rem',
    marginInline: 0,
  },
});
