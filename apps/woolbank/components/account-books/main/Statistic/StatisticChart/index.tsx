import styled from '@emotion/styled';
import { ResponsivePie } from '@nivo/pie';
import EmptyData from '../../../../../components/common/EmptyInfo';
import { AccountBookStatisticCategoryItem, useAccountStatisticList } from '../hooks/useAccountStatisticList';
import StatisticList from './StatisticList';

const PIE_CHART_COLOR_LIST: string[] = [
  '#F47560',
  '#36A2EB',
  '#f1e15b',
  '#4BC0C0',
  '#9966FF',
  '#379F7A',
  '#CC2738',
  '#8B628A',
  '#8FBE00',
  '#606060',
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#f1c40f',
  '#f39c12',
  '#F44336',
  '#CDDC39',
  '#00A8C6',
  '#00BCD4',
];

export interface AccountBookChartData {
  id: string;
  label: string;
  value: number;
  percentage: string;
  color: string;
  list: AccountBookStatisticCategoryItem[];
}

/**
 * 가계부 통계 - 차트 (파이)
 * @component
 */
const StatisticChart = () => {
  const { accountBookStatisticList } = useAccountStatisticList();
  const accountBookChartList: AccountBookChartData[] = accountBookStatisticList.map(
    ({ categoryName, amount, percentage, list }, index) => {
      return {
        id: categoryName,
        label: categoryName,
        value: amount,
        list,
        percentage: `${percentage}%`,
        color: PIE_CHART_COLOR_LIST[index] || PIE_CHART_COLOR_LIST[0],
      };
    },
  );

  if (accountBookChartList.length === 0) {
    return <EmptyData msg='통계 내역이 존재하지 않습니다.' />;
  }

  return (
    <>
      <SC.Container>
        <ResponsivePie
          data={accountBookChartList}
          colors={{ datum: 'data.color' }}
          margin={{ top: 60, right: 40, bottom: 60, left: 40 }}
          innerRadius={0.4}
          padAngle={3}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          arcLinkLabel={getLabel}
          arcLabel={getInnerLabel}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor={{ from: 'color', modifiers: [] }}
          arcLinkLabelsThickness={1}
          arcLinkLabelsStraightLength={6}
          arcLinkLabelsDiagonalLength={10}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        />
      </SC.Container>
      <StatisticList accountBookChartList={accountBookChartList} />
    </>
  );
};

export default StatisticChart;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getLabel(e: any) {
  const idLabel: string = e.id;
  return idLabel.length > 7 ? `${idLabel.substring(0, 7)}..` : idLabel;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getInnerLabel(e: any) {
  return e.data.percentage;
}

const SC = {
  Container: styled.div`
    height: 30rem;
    margin: 0 -2rem;
  `,
};
