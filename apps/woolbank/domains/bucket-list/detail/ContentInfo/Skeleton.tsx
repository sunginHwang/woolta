import { SkeletonBar } from '@wds';
import React from 'react';

/**
 * 버킷리스트 상세 - 컨텐츠 정보 로딩 스켈레톤
 * @component
 */
export const Skeleton = () => {
  return (
    <>
      <SkeletonBar width='80%' height='1.4rem' />
      <SkeletonBar width='60%' height='1.4rem' />
      <SkeletonBar width='50%' height='1.4rem' />
    </>
  );
};
