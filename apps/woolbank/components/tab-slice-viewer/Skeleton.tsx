import * as stylex from '@stylexjs/stylex';
import { memo } from 'react';
import { BucketListItem } from '../../domains/bucket-list/main/BucketListItem';

export const Skeleton = memo(() => {
  return (
    <div {...stylex.props(styles.listSkeleton)}>
      <div {...stylex.props(styles.wrapper)}>
        <div {...stylex.props(styles.content)}>
          {[...Array(10)].map((_, key) => (
            <div key={key}>
              <BucketListItem.Skeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const styles = stylex.create({
  listSkeleton: {
    marginTop: '-8.8rem',
  },
  content: {
    marginInline: '2rem',
  },
  wrapper: {
    marginTop: '3.8rem',
    height: '100%',
  },
});
