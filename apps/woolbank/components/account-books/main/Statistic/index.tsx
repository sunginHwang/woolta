/**
 * 가계부 통계 탭
 * @component
 */

import FilterInfo from './FilterInfo';
import StatisticChart from './StatisticChart';

const StatisticTab = () => {
  return (
    <>
      <FilterInfo />
      <StatisticChart />
    </>
  );
};

export default StatisticTab;
