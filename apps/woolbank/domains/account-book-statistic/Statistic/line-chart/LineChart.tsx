import * as stylex from '@stylexjs/stylex';
import { gray200, Text } from '@wds';
import { CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { groupBy, sortBy } from 'lodash-es';
import { Line } from 'react-chartjs-2';
import type { DateRange } from '../../../../utils/date';
import { useAccountStatisticList } from '../_common/hooks/useAccountStatisticList';
import type { AccountBookStatisticCategoryItem } from '../_common/hooks/useAccountStatisticListQuery';
import { AccountBookStatisticFilterAtom } from '../_common/stores/statisticFilter';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const LABEL_LIST = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export interface AccountBookChartData {
  id: string;
  label: string;
  value: number;
  percentage: string;
  color: string;
  list: AccountBookStatisticCategoryItem[];
}

interface Pa {
  value: number;
  label: string;
}

export const data = {
  labels: LABEL_LIST,
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

const styles = stylex.create({
  container: {
    height: '30rem',
    paddingTop: 0,
    paddingInline: '1.6rem',
    paddingBottom: 0,
  },
  linechart: {
    paddingBlock: '1.6rem',
    paddingInline: '1.6rem',
  },
  avgText: {
    paddingBottom: '15rem',
  },
});

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
      <div {...stylex.props(styles.container)}>
        <Text variant='title3Bold' color='gray900' mt={20} as='h3'>
          일자별 통계
        </Text>
        <div {...stylex.props(styles.linechart)}>
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
                    callback: (value) => Math.floor(Number(value) / 10_000),
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
        <Text variant='body3' color='gray900' as='p' alignment='right' xstyle={styles.avgText}>
          일 평균: {avgAmount.toLocaleString('ko-KR')}원 사용
        </Text>
      </div>
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
