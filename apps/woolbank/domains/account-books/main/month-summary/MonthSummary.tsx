'use client';

import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { formatWon } from '@woolta/woolbank-features';
import { useAccountBookList } from '../_common/hooks/useAccountBookList';

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    paddingTop: '0.4rem',
    paddingInline: '1.6rem',
  },
  hero: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.2rem',
    fontSize: '3rem',
    lineHeight: '3.8rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    fontVariantNumeric: 'tabular-nums',
    color: colorVars['--color-textPrimary'],
  },
  heroUnit: {
    fontSize: '2rem',
    lineHeight: '2.6rem',
    fontWeight: 600,
    color: colorVars['--color-textSecondary'],
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.6rem',
    paddingTop: '1rem',
  },
  pair: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.6rem',
  },
  divider: {
    width: '1px',
    height: '1.2rem',
    backgroundColor: colorVars['--color-borderStrong'],
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
});

/**
 * 이달 요약 — "쓴 돈" 총지출이 가장 크고, 아래 한 줄에 수입·순수입(수입 − 지출).
 * @component
 */
export const MonthSummary = () => {
  const { totalExpenditureAmount, totalIncomeAmount } = useAccountBookList();
  const balance = totalIncomeAmount - totalExpenditureAmount;

  return (
    <section aria-label='이달 요약' {...stylex.props(styles.section)}>
      <Text variant='body3' color='textSecondary' as='p'>
        쓴 돈
      </Text>
      <p {...stylex.props(styles.hero)}>
        {totalExpenditureAmount.toLocaleString('ko-KR')}
        <span {...stylex.props(styles.heroUnit)}>원</span>
      </p>
      <div {...stylex.props(styles.row)}>
        <span {...stylex.props(styles.pair)}>
          <Text variant='body3' color='textSecondary'>
            수입
          </Text>
          <Text variant='body4Bold' color='finIncome' xstyle={styles.tabular}>
            {formatWon(totalIncomeAmount, { sign: true })}
          </Text>
        </span>
        <span aria-hidden='true' {...stylex.props(styles.divider)} />
        <span {...stylex.props(styles.pair)}>
          <Text variant='body3' color='textSecondary'>
            순수입
          </Text>
          <Text variant='title4Bold' color='interactivePrimaryText' xstyle={styles.tabular}>
            {formatWon(balance, { sign: true })}
          </Text>
        </span>
      </div>
    </section>
  );
};
