import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { FC } from 'react';

interface Props {
  day: number;
  income_amount?: number;
  expenditure_amount?: number;
  onDayClick?: (day: number) => void;
}

const styles = stylex.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '7rem',
  },
  daySlot: {
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountSlot: {
    height: '5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
});

export const Day: FC<Props> = ({ day, income_amount = 0, expenditure_amount = 0, onDayClick }) => {
  const handleClick = () => {
    if (day !== 0 && (income_amount !== 0 || expenditure_amount !== 0)) {
      onDayClick?.(day);
    }
  };

  return (
    <div {...stylex.props(styles.container)} onClick={handleClick}>
      <div {...stylex.props(styles.daySlot)}>
        <Text variant='body3' color='gray700' as='p' mt={10}>
          {day}
        </Text>
      </div>
      <div {...stylex.props(styles.amountSlot)}>
        {expenditure_amount > 0 && (
          <Text variant='small3Regular' color='gray700'>
            -{expenditure_amount.toLocaleString('ko-KR')}
          </Text>
        )}
        {income_amount > 0 && (
          <Text variant='small3Regular' color='red500'>
            +{income_amount.toLocaleString('ko-KR')}
          </Text>
        )}
      </div>
    </div>
  );
};
