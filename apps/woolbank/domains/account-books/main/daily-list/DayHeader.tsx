import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { formatDayTitle, formatWon } from '@woolta/woolbank-features';

interface Props {
  /** 'YYYY-MM-DD' */
  date: string;
  /** 수입 − 지출 */
  totalAmount: number;
  /** 첫 그룹은 위 여백을 줄인다 */
  first?: boolean;
}

const styles = stylex.create({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: '2.8rem',
    paddingBottom: '0.8rem',
    paddingInline: '1.6rem',
  },
  first: {
    paddingTop: '0.8rem',
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
});

/**
 * 일별 리스트 날짜 헤더 — "11월 6일 금요일" + 일 합계
 * @component
 */
export const DayHeader = ({ date, totalAmount, first = false }: Props) => (
  <div {...stylex.props(styles.header, first && styles.first)}>
    <Text variant='small1Bold' color='textSecondary' as='h3'>
      {formatDayTitle(date)}
    </Text>
    <Text variant='small1Bold' color='textSecondary' xstyle={styles.tabular}>
      {formatWon(totalAmount, { sign: true })}
    </Text>
  </div>
);
