import 'chart.js/auto';
import { Text, gray200 } from '@wds';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { groupBy, sortBy } from 'lodash-es';
import { Line } from 'react-chartjs-2';
import { styled } from 'styled-components';
import { DateRange } from '../../../../utils/date';
import { AccountBookStatisticCategoryItem, useAccountStatisticList } from '../hooks/useAccountStatisticList';
import { AccountBookStatisticFilterAtom } from '../store';

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
  label: string;
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

export const LineChart = () => {
  const { accountBookStatisticList } = useAccountStatisticList();
  const { dateRange } = useAtomValue(AccountBookStatisticFilterAtom);

  const a = accountBookStatisticList.flatMap((item) =>
    item.list.map((i) => ({
      value: i.amount,
      date: dayjs(i.registerDateTime).format('M.D'),
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

  const chartData = {
    labels: getLabel(d, dateRange),
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
        <Text variant='title3Bold' color='gray900' mt={20} as='h3'>
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
        <Text variant='body3' color='gray900' as='p' alignment='right'>
          일 평균: {avgAmount.toLocaleString('ko-KR')}원 사용
        </Text>
      </SC.Container>
    </>
  );
};

function getLabel(list: Pa[], dateRange: DateRange) {
  const mapLoopup = {
    month: (item: Pa, index: number) => (index % 3 === 0 ? `${item.label.split('.')[1]}일` : ''),
    year: (item: Pa) => (item.label.endsWith('.1') ? item.label : ''),
    week: (item: Pa) => `${item.label.split('.')[1]}일`,
  };

  return list.map(mapLoopup[dateRange]);
}
const SC = {
  Container: styled.div`
    height: 30rem;
    padding: 0 1.6rem 10rem;

    .linechart {
      padding: 1.6rem;
    }
  `,
};
