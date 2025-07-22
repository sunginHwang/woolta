'use client';

import { withSuspense } from '@common';
import dynamic from 'next/dynamic';
import FullScreenLoading from '../../common/FullScreenLoading';
import { FilterInfo } from './filter-info/FilterInfo';
import { LineChart } from './line-chart/LineChart';
import { StatisticChartSkeleton } from './statistic-chart/StatisticChartSkeleton';
const StatisticChart = dynamic(() => import('./statistic-chart/StatisticChart'), {
  ssr: false,
  loading: () => <StatisticChartSkeleton />,
});

/**
 * 가계부 통계
 * @component
 */
export const Statistic = withSuspense(() => {
  return (
    <>
      <FilterInfo />
      <main>
        <StatisticChart />
        <LineChart />
      </main>
    </>
  );
}, <FullScreenLoading loading message='잠시만 기다려 주세요.' />);
