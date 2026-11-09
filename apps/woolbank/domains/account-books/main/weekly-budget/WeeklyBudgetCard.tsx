'use client';

import { withSuspense } from '@common';
import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { useWeeklyBudgetUsage } from '@woolta/woolbank-features';
import { WeeklyBudgetCardView } from './WeeklyBudgetCardView';

const styles = stylex.create({
  skeleton: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '2rem',
    paddingInline: '1.6rem',
  },
});

const WeeklyBudgetSkeleton = () => (
  <div aria-hidden='true' {...stylex.props(styles.skeleton)}>
    <SkeletonBar width='14rem' height='1.8rem' />
    <SkeletonBar width='100%' height='0.8rem' radius={4} />
    <SkeletonBar width='22rem' height='1.8rem' />
  </div>
);

/**
 * 주간 예산 사용 현황 — 서버가 계산한 이번 주(월~일, 서버 기준) 값을 그대로 보여준다.
 * 보고 있는 달과는 무관하다.
 * @component
 */
const WeeklyBudgetCardContainer = () => {
  const { usage } = useWeeklyBudgetUsage();

  return <WeeklyBudgetCardView {...usage} />;
};

export const WeeklyBudgetCard = withSuspense(WeeklyBudgetCardContainer, <WeeklyBudgetSkeleton />);
