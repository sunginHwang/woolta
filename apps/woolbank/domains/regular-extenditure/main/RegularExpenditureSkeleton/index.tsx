import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  container: {
    paddingBlock: '3rem',
    paddingInline: '1.6rem',
  },
  listContent: {
    marginTop: '1rem',
  },
  line: {
    backgroundColor: colorVars['--color-gray100'],
    height: '0.7rem',
    marginTop: '2rem',
  },
  listTop: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  list: {
    marginTop: '3rem',
  },
  title: {
    marginTop: '1rem',
    marginRight: 0,
    marginBottom: '2rem',
    marginLeft: 0,
  },
  oneWeek: {
    paddingBlock: 0,
    paddingInline: 0,
  },
  oneWeekFirst: {
    marginBottom: '1.5rem',
  },
});

/**
 * 정기 지출 리스트 -> 리스트 페이지 로딩 스켈레톤
 * @component
 */
const RegularExpenditureSkeleton = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.title)}>
        <SkeletonBar width='100%' height='5.4rem' />
      </div>
      <div {...stylex.props(styles.oneWeek)}>
        <div {...stylex.props(styles.oneWeekFirst)}>
          <SkeletonBar width='20.4rem' height='2.2rem' />
        </div>
        <SkeletonBar width='100%rem' height='4.3rem' />
      </div>
      <div {...stylex.props(styles.line)} />
      <div {...stylex.props(styles.list)}>
        <div {...stylex.props(styles.listTop)}>
          <SkeletonBar width='6rem' height='2.1rem' />
          <SkeletonBar width='7rem' height='2.1rem' />
        </div>
        <div {...stylex.props(styles.listContent)}>
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
        </div>
      </div>
      <div {...stylex.props(styles.list)}>
        <div {...stylex.props(styles.listTop)}>
          <SkeletonBar width='6rem' height='2.1rem' />
          <SkeletonBar width='7rem' height='2.1rem' />
        </div>
        <div {...stylex.props(styles.listContent)}>
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
        </div>
      </div>
    </div>
  );
};

export default RegularExpenditureSkeleton;
