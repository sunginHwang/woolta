import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';

const styles = stylex.create({
  container: {
    paddingTop: '1rem',
    paddingInline: '1.6rem',
    paddingBottom: 0,
  },
  titleWrapper: {
    marginBottom: '1.6rem',
  },
  amountWrapper: {
    marginTop: '0.5rem',
  },
});

/**
 * 가계부 리스트 스켈레톤
 * @component
 */
export const Skeleton = () => {
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
