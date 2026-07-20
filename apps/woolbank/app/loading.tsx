'use client';

import { SkeletonBar } from '@wds';
import styled from 'styled-components';

export default function Loading() {
  return (
    <>
      <SC.Header>
        <SkeletonBar className='title' width='60%' height='3.2rem' radius={12} />
        <SkeletonBar width='100%' height='12rem' radius={18} />
      </SC.Header>
      <SC.Content>
        {[...Array(8)].map((_, index) => {
          return (
            <div className='item' key={index}>
              <div className='top'>
                <SkeletonBar width='9rem' height='3rem' />
                <SkeletonBar width='6rem' height='2.1rem' />
              </div>
              <SkeletonBar width='100%' height='6.3rem' radius={18} />
            </div>
          );
        })}
      </SC.Content>
    </>
  );
}

const SC = {
  Header: styled.header`
    padding: 3rem 1.6rem 0;

    .title {
      margin-bottom: 2rem;
    }
  `,
  Content: styled.main`
    padding: 0 1.6rem;

    .item {
      margin-top: 3rem;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
    }
  `,
};
