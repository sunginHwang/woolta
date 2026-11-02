'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

export default function Loading() {
  return (
    <>
      <header {...stylex.props(styles.header)}>
        <SkeletonBar width='40%' height='3rem' radius={12} />
      </header>
      <main {...stylex.props(styles.content)}>
        <SkeletonBar width='100%' height='7.2rem' radius={8} />
        <SkeletonBar width='100%' height='7.2rem' radius={8} />
        <SkeletonBar width='100%' height='7.2rem' radius={8} />
      </main>
    </>
  );
}

const styles = stylex.create({
  header: {
    paddingTop: '3rem',
    paddingInline: '1.6rem',
    paddingBottom: '2rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
});
