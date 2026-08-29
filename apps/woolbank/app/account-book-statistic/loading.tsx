'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { StatisticChartSkeleton } from '../../domains/account-book-statistic/Statistic/statistic-chart/StatisticChartSkeleton';

export default function Loading() {
  return (
    <>
      <header {...stylex.props(styles.header)}>
        <SkeletonBar width='10rem' height='2.6rem' />
        <div {...stylex.props(styles.filter)}>
          <SkeletonBar width='9.4rem' height='33px' radius={13} />
          <SkeletonBar width='5rem' height='33px' radius={13} />
          <SkeletonBar width='12rem' height='33px' radius={13} />
        </div>
        <div {...stylex.props(styles.bar)} />
      </header>
      <main>
        <StatisticChartSkeleton />
      </main>
    </>
  );
}

const styles = stylex.create({
  header: {
    paddingTop: '2rem',
    paddingInline: '1.6rem',
    paddingBottom: 0,
  },
  filter: {
    marginTop: '2rem',
    marginBottom: '1.5rem',
    display: 'flex',
    gap: '1rem',
  },
  bar: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginBlock: 0,
    marginInline: '-1.6rem',
  },
});
