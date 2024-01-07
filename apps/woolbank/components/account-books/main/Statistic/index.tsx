import { withSuspense } from '@common';
import dynamic from 'next/dynamic';
import FullScreenLoading from '../../../../components/common/FullScreenLoading';
import FilterInfo from './FilterInfo';

const StatisticChart = dynamic(() => import('./StatisticChart'), { ssr: false });

/**
 * 가계부 통계 탭
 * @component
 */
const Statistic = () => {
  return (
    <>
      <FilterInfo />
      <StatisticChart />
    </>
  );
};

export default withSuspense(Statistic, <FullScreenLoading loading message='잠시만 기다려 주세요.' />);
