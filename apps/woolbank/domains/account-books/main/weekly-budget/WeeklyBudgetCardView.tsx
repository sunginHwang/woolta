'use client';

import * as stylex from '@stylexjs/stylex';
import { Button, Progress, Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { formatWon } from '@woolta/woolbank-features';
import Link from 'next/link';

export interface WeeklyBudgetCardViewProps {
  /** 설정 예산(원). 0 이면 미설정 */
  budget: number;
  /** 이번 주 사용액 */
  spent: number;
  /** budget − spent. 음수면 초과 */
  remaining: number;
  /** round(spent / budget × 100). budget 0 이면 0 */
  percentage: number;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '2rem',
    paddingInline: '1.6rem',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '1.2rem',
  },
  tabular: {
    fontVariantNumeric: 'tabular-nums',
  },
  empty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.2rem',
    marginTop: '2rem',
    marginInline: '1.6rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
    borderRadius: '1.2rem',
    backgroundColor: colorVars['--color-fillSubtle'],
  },
  emptyText: {
    flex: 1,
    minWidth: 0,
  },
});

/**
 * 가계부 홈의 주간 예산 블록. 예산이 없으면 설정 유도, 있으면 진행바 + 썼어요/남았어요.
 * 초과하면 비율·남은 금액을 statusError 로.
 * @component
 */
export const WeeklyBudgetCardView = ({ budget, spent, remaining, percentage }: WeeklyBudgetCardViewProps) => {
  if (budget <= 0) {
    return (
      <div {...stylex.props(styles.empty)}>
        <Text variant='body4Regular' color='textSecondary' as='p' xstyle={styles.emptyText}>
          이번 주 예산을 정해 두면 남은 금액을 바로 볼 수 있어요
        </Text>
        <Link href='/settings/weekly-budget' tabIndex={-1}>
          <Button variant='secondary' size='small'>
            예산 설정하기
          </Button>
        </Link>
      </div>
    );
  }

  const isOver = remaining < 0;
  const statusColor = isOver ? 'statusError' : 'textPrimary';

  return (
    <section aria-label='이번 주 예산' {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.row)}>
        <Text variant='body4Regular' color='textSecondary'>
          이번 주 예산{' '}
          <Text variant='body4Regular' color='textSecondary' xstyle={styles.tabular}>
            {formatWon(budget)}
          </Text>
        </Text>
        <Text variant='body4Bold' color={statusColor} xstyle={styles.tabular}>
          {percentage}%
        </Text>
      </div>
      <Progress
        value={Math.min(percentage, 100)}
        tone={isOver ? 'error' : 'primary'}
        showLabel={false}
        size='medium'
        aria-label='이번 주 예산 사용률'
      />
      <div {...stylex.props(styles.row)}>
        <Text variant='body3' color='textSecondary'>
          <Text variant='body4Bold' color='textPrimary' xstyle={styles.tabular}>
            {formatWon(spent)}
          </Text>{' '}
          썼어요
        </Text>
        <Text variant='body3' color='textSecondary'>
          <Text variant='body4Bold' color={isOver ? 'statusError' : 'finIncome'} xstyle={styles.tabular}>
            {formatWon(Math.abs(remaining))}
          </Text>{' '}
          {isOver ? '초과했어요' : '남았어요'}
        </Text>
      </div>
    </section>
  );
};
