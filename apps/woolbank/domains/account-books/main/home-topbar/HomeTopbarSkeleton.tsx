import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const styles = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '5.6rem',
    paddingInline: '0.8rem',
  },
  side: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '8.8rem',
  },
  sideRight: {
    justifyContent: 'flex-end',
  },
  icon: {
    marginInline: '0.8rem',
  },
});

/**
 * 홈 상단바 스켈레톤 — 가운데 월 제목, 오른쪽 알림·설정 아이콘 자리
 * @component
 */
export const HomeTopbarSkeleton = () => (
  <div aria-hidden='true' {...stylex.props(styles.root)}>
    <div {...stylex.props(styles.side)} />
    <SkeletonBar width='9rem' height='2.4rem' radius={8} />
    <div {...stylex.props(styles.side, styles.sideRight)}>
      <SkeletonBar width='2.4rem' height='2.4rem' radius={12} xstyle={styles.icon} />
      <SkeletonBar width='2.4rem' height='2.4rem' radius={12} xstyle={styles.icon} />
    </div>
  </div>
);
