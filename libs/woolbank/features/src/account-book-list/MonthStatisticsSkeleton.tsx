'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

/**
 * 이달의 통계 스켈레톤
 * @component
 */
const MonthStatisticsSkeleton = () => {
  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.titleWrapper)}>
        <SkeletonBar width='15rem' height='2.6rem' />
      </div>
      <div {...stylex.props(styles.amountWrapper)}>
        <SkeletonBar width='12rem' height='1.95rem' />
      </div>
      <div {...stylex.props(styles.amountWrapper)}>
        <SkeletonBar width='8rem' height='1.95rem' />
      </div>
    </section>
  );
};

export default MonthStatisticsSkeleton;

const styles = stylex.create({
  container: {
    paddingTop: '1rem',
    paddingBottom: 0,
    paddingInline: '1.6rem',
  },
  titleWrapper: {
    marginBottom: '1.6rem',
  },
  amountWrapper: {
    marginTop: '0.5rem',
  },
});
