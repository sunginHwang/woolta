import { styled } from 'styled-components';
import { Text } from '@wds';
import { FC } from 'react';

interface Props {
  // 이달의 지출 금액
  amount: number;
}

/**
 * 정기 지출 리스트 -> 이달의 지출 금액 정보
 * @component
 */
const RegularAmountInfo: FC<Props> = ({ amount }) => {
  return (
    <SC.RegularAmountInfo>
      <Text variant='title4Bold' color='graySecondary'>
        이달의 정기 지출
      </Text>
      <Text variant='body3' color='red500'>
        <b>{amount.toLocaleString('ko-KR')}</b> 원
      </Text>
    </SC.RegularAmountInfo>
  );
};

const SC = {
  RegularAmountInfo: styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem 0 2rem 0;
    padding: 1.5rem;
    border-radius: 1.8rem;
    background-color: ${({ theme }) => theme.colors.gray150};

    b {
      font-weight: 600;
    }
  `,
};

export default RegularAmountInfo;
