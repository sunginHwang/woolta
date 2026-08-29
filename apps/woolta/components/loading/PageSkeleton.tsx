'use client';

import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    maxWidth: '72rem',
    padding: '2.4rem',
  },
  rows: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
});

/**
 * 라우트 전환(RSC 로딩) 동안 콘텐츠 영역에 표시하는 공용 스켈레톤.
 * 각 앱 세그먼트의 loading.tsx 에서 사용한다.
 */
export const PageSkeleton = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <SkeletonBar width='18rem' height='2.8rem' radius={8} />
      <div {...stylex.props(styles.rows)}>
        <SkeletonBar width='100%' height='4.4rem' radius={10} />
        <SkeletonBar width='100%' height='4.4rem' radius={10} />
        <SkeletonBar width='82%' height='4.4rem' radius={10} />
        <SkeletonBar width='90%' height='4.4rem' radius={10} />
        <SkeletonBar width='70%' height='4.4rem' radius={10} />
      </div>
    </div>
  );
};
