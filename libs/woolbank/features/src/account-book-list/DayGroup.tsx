'use client';

import { Text } from '@wds';
import { ReactNode } from 'react';
import { styled } from 'styled-components';

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
    <SC.DayGroup>
      <SC.DayInfo>
        <Text variant='body3' color='gray600'>
          {days}일
        </Text>
        <Text variant='title5Medium' color={isSavedAmount ? 'red500' : 'gray900'}>
          {totalAmount.toLocaleString('ko-KR')}원
        </Text>
      </SC.DayInfo>
      {children}
    </SC.DayGroup>
  );
};

export default DayGroup;

const SC = {
  DayGroup: styled.div`
    & + & {
      margin-top: 3.4rem;
    }
  `,
  DayInfo: styled.div`
    padding-bottom: 1rem;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray200};
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin: 1rem 0;
  `,
};