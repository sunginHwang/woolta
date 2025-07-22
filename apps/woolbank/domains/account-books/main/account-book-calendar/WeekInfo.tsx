import { Text } from '@wds';
import styled from 'styled-components';

interface Props {
  income_amount?: number;
  expenditure_amount?: number;
}

export const WeekInfo = ({ income_amount = 0, expenditure_amount = 0 }: Props) => {
  return (
    <SC.Container>
      {income_amount > 0 && (
        <Text variant='small1Medium' color='red500' as='p'>
          +{income_amount.toLocaleString('ko-KR')}원
        </Text>
      )}
      {expenditure_amount > 0 && (
        <Text variant='small1Medium' color='gray700' as='p'>
          -{expenditure_amount.toLocaleString('ko-KR')}원
        </Text>
      )}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 16px;
    height: 2rem;
    background-color: ${({ theme }) => theme.colors.gray150};

    > * + * {
      margin-left: 1rem;
    }
  `,
};
