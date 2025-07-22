'use client';

import { SkeletonBar } from '@wds';
import styled from 'styled-components';

export const StatisticChartSkeleton = () => {
  return (
    <SC.Container>
      <SkeletonBar className='title' width='9rem' height='2.6rem' />
      <div className='chart'>
        <SkeletonBar width='18rem' height='18rem' radius={180} />
      </div>
      <div className='list'>
        {[...new Array(4)].map((_, index) => {
          return (
            <div className='item' key={index}>
              <SkeletonBar width='13rem' height='2.4rem' />
              <SkeletonBar width='6.5rem' height='2.4rem' />
            </div>
          );
        })}
      </div>
      <SkeletonBar width='100%' height='4.2rem' className='more' />
    </SC.Container>
  );
};

const SC = {
  Container: styled.section`
    padding-bottom: 1rem;
    margin: 0 1.6rem;

    .title {
      margin: 2rem 0 2rem;
    }

    .chart {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 7.5rem;
    }

    .list {
      padding-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      .item {
        display: flex;
        justify-content: space-between;
      }
    }

    .more {
      margin-top: 0.6rem;
    }
  `,
};
