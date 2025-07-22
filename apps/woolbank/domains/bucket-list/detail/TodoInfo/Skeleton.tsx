import { SkeletonBar } from '@wds';

/**
 * 버킷리스트 상세 - 할일 로딩 리스트
 * @component
 */

export const Skeleton = () => {
  return (
    <>
      {[...Array(4)].map((_, index) => (
        <SkeletonBar key={index} width='100%' height='5.4rem' />
      ))}
    </>
  );
};
