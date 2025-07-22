import React, { memo } from 'react';
import styled from 'styled-components';
import { BucketListItem } from '../../bucket-list/main/BucketListItem';

export const Skeleton = memo(() => {
  return (
    <SC.ListSkeleton>
      <SC.Wrapper>
        <SC.Content>
          {[...Array(10)].map((_, key) => (
            <div key={key}>
              <BucketListItem.Skeleton />
            </div>
          ))}
        </SC.Content>
      </SC.Wrapper>
    </SC.ListSkeleton>
  );
});

const SC = {
  ListSkeleton: styled.div`
    margin-top: -8.8rem;
  `,
  Content: styled.div`
    margin: 0 2rem;
  `,
  Wrapper: styled.div`
    margin-top: 3.8rem;
    height: 100%;
  `,
  Title: styled.div`
    height: 4.8rem;
    display: flex;
    justify-content: flex-start;
    margin-left: 2rem;
    align-items: center;

    p {
      font-size: 1.8rem;
      font-weight: 800;
      color: ${({ theme }) => theme.colors.black};
    }
  `,
};
