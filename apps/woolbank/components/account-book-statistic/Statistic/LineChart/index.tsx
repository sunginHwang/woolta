import 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';
import {
  AccountBookStatistic,
  AccountBookStatisticCategoryItem,
  useAccountStatisticList,
} from '../hooks/useAccountStatisticList';
import dayjs from 'dayjs';
import { groupBy, sortBy } from 'lodash-es';
import { Text, gray200, gray400 } from '@wds';

export interface AccountBookChartData {
  id: string;
  label: string;
  value: number;
  percentage: string;
  color: string;
  list: AccountBookStatisticCategoryItem[];
}
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

interface Pa {
  value: number;
  date: string;
}
export const data = {
  labels,
  datasets: [
    {
      label: '',
      data: [12, 19, 3, 5, 2, 3],
      borderColor: '#F47560',
      pointRadius: 0,
      spanGaps: true,
    },
  ],
};

const LineChart = () => {
  const { accountBookStatisticList } = useAccountStatisticList();

  const a = accountBookStatisticList.flatMap((item) =>
    item.list.map((i) => ({
      value: i.amount,
      date: dayjs(i.registerDateTime).format('M.DD'),
    })),
  );

  const c = Object.entries(groupBy(a, (item) => item.date)).map(([days, accountBookList]) => {
    return {
      label: days,
      value: accountBookList.reduce((acc, item) => (acc += item.value), 0),
    };
  });

  const d = sortBy(c, (item) => new Date(item.label));
  const avgAmount = Math.floor(d.reduce((acc, i) => (acc += i.value), 0) / d.length);
  console.log(avgAmount);

  const chartData = {
    labels: d.map((item, index) => (index % 3 === 0 ? item.label : '')),
    datasets: [
      {
        data: d.map((item) => item.value),
        borderColor: '#F47560',
        pointRadius: 0,
        spanGaps: true,
      },
      {
        data: [...Array(d.length)].map(() => avgAmount),
        borderColor: gray200,
        pointRadius: 0,
        spanGaps: true,
      },
    ],
  };

  return (
    <>
      <SC.Container>
        <Text variant='title2Bold' color='gray900' ml={16} mt={20} as='h3'>
          일자별 통계
        </Text>
        <div className='linechart'>
          <Line
            data={chartData}
            options={{
              responsive: true,
              interaction: {
                intersect: false,
              },
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  grid: {
                    display: false,
                  },
                  ticks: {
                    callback: function (value) {
                      return Math.floor(Number(value) / 10_000);
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </div>
      </SC.Container>
    </>
  );
};

export default LineChart;

const SC = {
  Container: styled.div`
    height: 30rem;
    padding: 0 1rem 10rem;

    .linechart {
      padding: 1.6rem;
    }
  `,
};
