import { SkeletonBar } from '@wds';
import React from 'react';
import styled from 'styled-components';
import { CardItem } from '../../../../components/CardItem';

/**
 * 버킷리스 - 리스트 아이템 스켈레톤 영역
 * @component
 */

function ItemSkeleton() {
  return (
    <CardItem useSideMargin>
      <SC.BucketListItem data-cy='bucketListSkeleton'>
        <div>
          <SC.Circle />
          <SC.Content>
            <SkeletonBar width='8rem' height='1.82rem' />
            <SkeletonBar width='13rem' height='1.68rem' className='description' />
          </SC.Content>
        </div>
      </SC.BucketListItem>
    </CardItem>
  );
}

export default React.memo(ItemSkeleton);

const SC = {
  BucketListItem: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    > div {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .description {
      margin-top: 4px;
    }
  `,
  Content: styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 1.4rem;
  `,
  Circle: styled.div`
    width: 5.2rem;
    height: 5.2rem;
    min-width: 5.2rem;
    min-height: 5.2rem;
    background-color: #e6a3a2;
    border-radius: 50%;
  `,
};
