import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const styles = stylex.create({
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    paddingTop: '0.4rem',
    paddingInline: '1.6rem',
  },
  incomeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.6rem',
    paddingTop: '0.4rem',
  },
  budget: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    marginTop: '2rem',
    paddingInline: '1.6rem',
  },
  budgetRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  calendar: {
    paddingTop: '1.6rem',
    paddingInline: '1.2rem',
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    justifyItems: 'center',
    paddingBottom: '0.8rem',
  },
  week: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    justifyItems: 'center',
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    paddingTop: '0.6rem',
    paddingBottom: '0.4rem',
  },
  toggle: {
    display: 'flex',
    justifyContent: 'center',
    paddingBlock: '0.8rem',
  },
});

/**
 * 이달 요약 + 주간 예산 + 접힌 달력(한 주) 자리 스켈레톤.
 * 실제 레이아웃과 같은 높이로 그려 데이터가 들어와도 화면이 튀지 않게 한다.
 * @component
 */
export const MonthSummarySkeleton = () => (
  <div aria-hidden='true'>
    <section {...stylex.props(styles.summary)}>
      <SkeletonBar width='4rem' height='1.8rem' />
      <SkeletonBar width='18rem' height='3.6rem' radius={8} />
      <div {...stylex.props(styles.incomeRow)}>
        <SkeletonBar width='9rem' height='1.8rem' />
        <SkeletonBar width='10rem' height='1.8rem' />
      </div>
    </section>
    <section {...stylex.props(styles.budget)}>
      <div {...stylex.props(styles.budgetRow)}>
        <SkeletonBar width='14rem' height='1.6rem' />
        <SkeletonBar width='3.2rem' height='1.6rem' />
      </div>
      <SkeletonBar width='100%' height='0.8rem' radius={4} />
      <div {...stylex.props(styles.budgetRow)}>
        <SkeletonBar width='10rem' height='1.8rem' />
        <SkeletonBar width='12rem' height='1.8rem' />
      </div>
    </section>
    <section {...stylex.props(styles.calendar)}>
      <div {...stylex.props(styles.weekdays)}>
        {WEEKDAYS.map((day) => (
          <SkeletonBar key={day} width='1.2rem' height='1.4rem' />
        ))}
      </div>
      <div {...stylex.props(styles.week)}>
        {WEEKDAYS.map((day) => (
          <div key={day} {...stylex.props(styles.day)}>
            <SkeletonBar width='3rem' height='3rem' radius={15} />
            <SkeletonBar width='3.6rem' height='1.2rem' />
          </div>
        ))}
      </div>
      <div {...stylex.props(styles.toggle)}>
        <SkeletonBar width='2.4rem' height='1.6rem' />
      </div>
    </section>
  </div>
);
