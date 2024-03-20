'use client';

import { withSuspense } from '@common';
import dynamic from 'next/dynamic';
import FullScreenLoading from '../../common/FullScreenLoading';
import FilterInfo from './FilterInfo';

const StatisticChart = dynamic(() => import('./StatisticChart'), { ssr: false });

/**
 * 가계부 통계
 * @component
 */
export const Statistic = withSuspense(() => {
  return (
    <>
      <FilterInfo />
      <StatisticChart />
    </>
  );
}, <FullScreenLoading loading message='잠시만 기다려 주세요.' />);
