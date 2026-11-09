import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const GROUPS = ['a', 'b', 'c'];
const ROWS = ['a', 'b', 'c'];

const styles = stylex.create({
  root: {
    paddingTop: '0.8rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '2.8rem',
    paddingBottom: '0.8rem',
    paddingInline: '1.6rem',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    minHeight: '5.6rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
  },
  body: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
});

/**
 * 일별 리스트 스켈레톤 — 날짜 헤더 + 행 3개 × 3그룹
 * @component
 */
export const DailyListSkeleton = () => (
  <div aria-hidden='true' {...stylex.props(styles.root)}>
    {GROUPS.map((group) => (
      <div key={group}>
        <div {...stylex.props(styles.header)}>
          <SkeletonBar width='10rem' height='1.6rem' />
          <SkeletonBar width='7rem' height='1.6rem' />
        </div>
        {ROWS.map((row) => (
          <div key={row} {...stylex.props(styles.row)}>
            <SkeletonBar width='3.6rem' height='3.6rem' radius={18} />
            <div {...stylex.props(styles.body)}>
              <SkeletonBar width='12rem' height='1.6rem' />
              <SkeletonBar width='7rem' height='1.4rem' />
            </div>
            <SkeletonBar width='7rem' height='1.8rem' />
          </div>
        ))}
      </div>
    ))}
  </div>
);
