'use client';

import { SkeletonBar } from '@wds';
import styled from 'styled-components';

export default function Loading() {
  return (
    <>
      <SC.Header>
        <SkeletonBar width='40%' height='3rem' radius={12} />
      </SC.Header>
      <SC.Content>
        <SkeletonBar width='100%' height='12rem' radius={18} />
      </SC.Content>
    </>
  );
}

const SC = {
  Header: styled.header`
    padding: 3rem 1.6rem 2rem;
  `,
  Content: styled.main`
    padding: 0 1.6rem;
  `,
};
