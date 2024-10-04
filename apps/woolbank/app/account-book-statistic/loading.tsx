'use client';

import { SkeletonBar } from '@wds';
import { StatisticChartSkeleton } from '../../components/account-book-statistic/Statistic/StatisticChart/StatisticChartSkeleton';
import styled from 'styled-components';

export default function Loading() {
  return (
    <>
      <SC.Header>
        <SkeletonBar width='10rem' height='2.6rem' />
        <div className='filter'>
          <SkeletonBar width='9.4rem' height='33px' radius={13} />
          <SkeletonBar width='5rem' height='33px' radius={13} />
          <SkeletonBar width='12rem' height='33px' radius={13} />
        </div>
        <div className='bar' />
      </SC.Header>
      <main>
        <StatisticChartSkeleton />
      </main>
    </>
  );
}

const SC = {
  Header: styled.header`
    padding: 2rem 1.6rem 0;

    .filter {
      margin: 2rem 0 1.5rem;
      display: flex;
      gap: 1rem;
    }

    .bar {
      background-color: ${({ theme }) => theme.colors.gray100};
      height: 0.7rem;
      margin: 0 -1.6rem;
    }
  `,
  Content: styled.main`
    padding: 0 1.6rem;

    .title {
      margin: 2rem 0 2rem;
    }
  `,
};
