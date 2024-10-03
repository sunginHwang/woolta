'use client';

import { SkeletonBar } from '@wds';
import { styled } from 'styled-components';
import layouts from '../../../style/layouts';

export const PostLoading = () => {
  return (
    <SC.Container>
      <SC.Header>
        <SkeletonBar className='title' width='65%' height='2.6rem' />
        <div className='sub-info'>
          <SkeletonBar width='147px' height='1.6rem' />
        </div>
      </SC.Header>
      <SkeletonBar className='content' width='100%' height='100rem' />
    </SC.Container>
  );
};

const SC = {
  Header: styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    border-bottom: 0.1rem solid ${({ theme }) => theme.colors.bgSecondary};

    .title {
      margin: 3rem 0 5rem;
    }

    .sub-info {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
  `,
  Container: styled.div`
    text-align: left;
    margin-top: 2rem;

    .content {
      margin-top: 3.2rem;
    }

    @media screen and (max-width: ${layouts.mobileWidth}) {
      padding: 0 2rem 0 2rem;
    }

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding: 0 1.6rem 0 1.6rem;
    }
  `,
};
