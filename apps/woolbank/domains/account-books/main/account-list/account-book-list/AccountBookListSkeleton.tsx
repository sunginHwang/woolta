import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import { colorVars } from '@wds/tokens.stylex';

const LIST_ITEM_HEIGHT = '2.1rem';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.4rem',
  },
  dayGroup: {
    paddingBottom: '1rem',
    borderBottomWidth: '0.1rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray150'],
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBlock: '1rem',
    marginInline: 0,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  item: {},
});

/**
 * 가계부 리스트 스켈레톤
 * @component
 */
export const AccountBookListSkeleton = () => {
  return (
    <section {...stylex.props(styles.container)}>
      {[...Array(5)].map((_, index) => (
        <div {...stylex.props(styles.item)} key={index}>
          <div {...stylex.props(styles.dayGroup)}>
            <SkeletonBar width='3rem' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='8rem' height={LIST_ITEM_HEIGHT} />
          </div>
          <div {...stylex.props(styles.list)}>
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
            <SkeletonBar width='100%' height={LIST_ITEM_HEIGHT} />
          </div>
        </div>
      ))}
    </section>
  );
};
