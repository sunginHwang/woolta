'use client';

import { SkeletonBar } from '@wds';
import styled from 'styled-components';

export default function Loading() {
  return (
    <>
      <SC.Header>
        <SkeletonBar className='title' width='100%' height='5.2rem' radius={18} />
        <SkeletonBar width='100%' height='8rem' radius={18} />
        <div className='bar' />
      </SC.Header>
      <SC.Content>
        {[...Array(10)].map((_, index) => {
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

    .bar {
      background-color: ${({ theme }) => theme.colors.gray100};
      height: 0.7rem;
      margin-top: 2rem;
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
