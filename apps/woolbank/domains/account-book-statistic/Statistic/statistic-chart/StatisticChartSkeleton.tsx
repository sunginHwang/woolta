'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const styles = stylex.create({
  container: {
    paddingBottom: '1rem',
    marginBlock: 0,
    marginInline: '1.6rem',
  },
  titleWrapper: {
    marginTop: '2rem',
    marginBottom: '2rem',
    marginInline: 0,
  },
  chart: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '7.5rem',
  },
  list: {
    paddingBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  moreWrapper: {
    marginTop: '0.6rem',
  },
});

export const StatisticChartSkeleton = () => {
  return (
    <section {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.titleWrapper)}>
        <SkeletonBar width='9rem' height='2.6rem' />
      </div>
      <div {...stylex.props(styles.chart)}>
        <SkeletonBar width='18rem' height='18rem' radius={180} />
      </div>
      <div {...stylex.props(styles.list)}>
        {[...new Array(4)].map((_, index) => {
          return (
            <div {...stylex.props(styles.listItem)} key={index}>
              <SkeletonBar width='13rem' height='2.4rem' />
              <SkeletonBar width='6.5rem' height='2.4rem' />
            </div>
          );
        })}
      </div>
      <div {...stylex.props(styles.moreWrapper)}>
        <SkeletonBar width='100%' height='4.2rem' />
      </div>
    </section>
  );
};
