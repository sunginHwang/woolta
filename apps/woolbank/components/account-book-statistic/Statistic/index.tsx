'use client';

import { withSuspense } from '@common';
import dynamic from 'next/dynamic';
import { styled } from 'styled-components';
import FullScreenLoading from '../../common/FullScreenLoading';
import FilterInfo from './FilterInfo';
import { LineChart } from './LineChart';

const StatisticChart = dynamic(() => import('./StatisticChart'), { ssr: false });

/**
 * 가계부 통계
 * @component
 */
export const Statistic = withSuspense(() => {
  return (
    <>
      <FilterInfo />
      <SC.Line />
      <StatisticChart />
      <SC.Line />
      <LineChart />
    </>
  );
}, <FullScreenLoading loading message='잠시만 기다려 주세요.' />);

const SC = {
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin-top: 2rem;
  `,
};
