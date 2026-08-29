import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { ReactNode } from 'react';

interface Props {
  days: string;
  totalAmount: number;
  children: ReactNode;
}

const styles = stylex.create({
  dayGroup: {},
  dayInfo: {
    paddingBottom: '1rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray200'],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBlock: '1rem',
    marginInline: 0,
  },
});

/**
 * 가게부 리스트 날짜 그룹
 * @component
 */
const DayGroup = ({ days, totalAmount, children }: Props) => {
  const is_saved_amount = totalAmount > 0;
  return (
    <div {...stylex.props(styles.dayGroup)}>
      <div {...stylex.props(styles.dayInfo)}>
        <Text variant='body3' color='gray600'>
          {days}일
        </Text>
        <Text variant='title5Medium' color={is_saved_amount ? 'red500' : 'gray900'}>
          {totalAmount.toLocaleString('ko-JR')}원
        </Text>
      </div>
      {children}
    </div>
  );
};

export default DayGroup;
