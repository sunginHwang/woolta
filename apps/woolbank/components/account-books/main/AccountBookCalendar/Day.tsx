import { Text } from '@wds';
import { FC } from 'react';
import styled from 'styled-components';

interface Props {
  day: number;
  income_amount?: number;
  expenditure_amount?: number;
  onDayClick?: (day: number) => void;
}

export const Day: FC<Props> = ({ day, income_amount = 0, expenditure_amount = 0, onDayClick }) => {
  const handleClick = () => {
    if (day !== 0 && (income_amount !== 0 || expenditure_amount !== 0)) {
      onDayClick?.(day);
    }
  };

  return (
    <SC.Container onClick={handleClick}>
      <div className='day'>
        <Text variant='body3' color='gray700' as='p' mt={10}>
          {day}
        </Text>
      </div>
      <div className='amount'>
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
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    flex-direction: column;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 7rem;

    .day {
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .amount {
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }
  `,
};
