import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { formatWeekLabel, formatWon } from '@woolta/woolbank-features';

interface Props {
  weekIndex: number;
  expense: number;
  income: number;
}

const styles = stylex.create({
  pill: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '0.2rem',
    marginBottom: '0.6rem',
    marginInline: '0.4rem',
    paddingBlock: '0.4rem',
    paddingInline: '0.8rem',
    borderRadius: '0.6rem',
    backgroundColor: colorVars['--color-fillSubtle'],
  },
  amounts: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '1rem',
  },
  pair: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.4rem',
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
});

/**
 * 펼친 달력에서 각 주 아래 합계 행 — "1주차 ···· 수입 +264,000원 · 지출 −4,973,904원".
 * 수입이 없으면 "지출" 라벨 없이 금액만.
 * @component
 */
export const WeekSummaryRow = ({ weekIndex, expense, income }: Props) => {
  const hasIncome = income > 0;
  const label = `${formatWeekLabel(weekIndex)} 지출 ${formatWon(-expense, { sign: true })}${hasIncome ? `, 수입 ${formatWon(income, { sign: true })}` : ''}`;

  return (
    <div role='note' aria-label={label} {...stylex.props(styles.pill)}>
      <Text variant='small2Medium' color='textTertiary'>
        {formatWeekLabel(weekIndex)}
      </Text>
      <span {...stylex.props(styles.amounts)}>
        {hasIncome && (
          <span {...stylex.props(styles.pair)}>
            <Text variant='small2Medium' color='textTertiary'>
              수입
            </Text>
            <Text variant='small1Bold' color='finIncome' xstyle={styles.tabular}>
              {formatWon(income, { sign: true })}
            </Text>
          </span>
        )}
        <span {...stylex.props(styles.pair)}>
          {hasIncome && (
            <Text variant='small2Medium' color='textTertiary'>
              지출
            </Text>
          )}
          <Text variant='small1Bold' color='textSecondary' xstyle={styles.tabular}>
            {formatWon(-expense, { sign: true })}
          </Text>
        </span>
      </span>
    </div>
  );
};
