import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const styles = stylex.create({
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    paddingTop: '0.4rem',
    paddingInline: '1.6rem',
  },
  calendar: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '2.4rem',
  },
});

/**
 * 이달 요약 + 접힌 달력 자리 스켈레톤
 * @component
 */
export const MonthSummarySkeleton = () => (
  <section aria-hidden='true' {...stylex.props(styles.section)}>
    <SkeletonBar width='4rem' height='1.8rem' />
    <SkeletonBar width='16rem' height='3.6rem' />
    <SkeletonBar width='20rem' height='1.8rem' />
    <div {...stylex.props(styles.calendar)}>
      {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
        <SkeletonBar key={day} width='3rem' height='3rem' radius={15} />
      ))}
    </div>
  </section>
);
