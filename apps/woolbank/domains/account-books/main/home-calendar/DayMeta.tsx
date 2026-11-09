import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { abbreviateWon } from '@woolta/woolbank-features';

export interface DayAmount {
  expense: number;
  income: number;
}

const styles = stylex.create({
  line: {
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.02em',
    whiteSpace: 'nowrap',
    minHeight: '1.4rem',
  },
});

/**
 * 달력 셀의 숫자 아래 — 지출 축약(−4.7만), 수입 있으면 +26.4만 한 줄 더.
 * 지출 줄은 비어 있어도 높이를 지켜 셀 높이가 날마다 달라지지 않게 한다.
 * @component
 */
export const DayMeta = ({ expense, income }: Partial<DayAmount>) => (
  <>
    <Text variant='small3Medium' color='textSecondary' as='span' xstyle={styles.line}>
      {expense ? abbreviateWon(-expense, { sign: true }) : ''}
    </Text>
    {income ? (
      <Text variant='small3Medium' color='finIncome' as='span' xstyle={styles.line}>
        {abbreviateWon(income, { sign: true })}
      </Text>
    ) : null}
  </>
);
