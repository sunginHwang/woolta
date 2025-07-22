'use client';

import dayjs from 'dayjs';
import { styled } from 'styled-components';
import { useRegularExtentureList } from '../hooks/useRegularExtentureList';
import OneWeekAgoList from './OneWeekAgoList';
import RegularAmountInfo from './RegularAmountInfo';
import { RegularExpenditure } from '../hooks/useRegularExtentureListQuery';

const ONE_WEEK_DAY = 7;

/**
 * 정기 지출 리스트 -> 상단 지출 정보 모음
 * @component
 */
const SummeryInfo = () => {
  const { totalAmount, flatRegularExpenditureTypeList } = useRegularExtentureList();

  const oneWeekRemainList: RegularExpenditure[] = flatRegularExpenditureTypeList
    .filter(isOneWeekRemain)
    .sort((a, b) => a.regularDate - b.regularDate);

  return (
    <header>
      <SC.Container>
        <RegularAmountInfo amount={totalAmount} />
        <OneWeekAgoList regularExpenditureList={oneWeekRemainList} />
      </SC.Container>
      <SC.Line />
    </header>
  );
};

export default SummeryInfo;

const SC = {
  Container: styled.section`
    padding: 2rem 1.6rem 0;
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin-top: 2rem;
  `,
};

function isOneWeekRemain(item: RegularExpenditure) {
  const remainDay = dayjs().diff(dayjs(item.regularExpenditureDay), 'day');
  return remainDay >= 0 && remainDay <= ONE_WEEK_DAY;
}
