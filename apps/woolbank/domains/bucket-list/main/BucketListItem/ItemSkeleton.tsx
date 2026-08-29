import * as stylex from '@stylexjs/stylex';
import { SkeletonBar } from '@wds';
import React from 'react';
import { CardItem } from '../../../../components/card-item/CardItem';

const styles = stylex.create({
  bucketListItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  innerDiv: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '1.4rem',
  },
  circle: {
    width: '5.2rem',
    height: '5.2rem',
    minWidth: '5.2rem',
    minHeight: '5.2rem',
    backgroundColor: '#e6a3a2',
    borderRadius: '50%',
  },
  description: {
    marginTop: '4px',
  },
});

/**
 * 버킷리스 - 리스트 아이템 스켈레톤 영역
 * @component
 */

function ItemSkeleton() {
  return (
    <CardItem useSideMargin>
      <div {...stylex.props(styles.bucketListItem)} data-cy='bucketListSkeleton'>
        <div {...stylex.props(styles.innerDiv)}>
          <div {...stylex.props(styles.circle)} />
          <div {...stylex.props(styles.content)}>
            <SkeletonBar width='8rem' height='1.82rem' />
            <div {...stylex.props(styles.description)}>
              <SkeletonBar width='13rem' height='1.68rem' />
            </div>
          </div>
        </div>
      </div>
    </CardItem>
  );
}

export default React.memo(ItemSkeleton);
