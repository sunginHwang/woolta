import { SkeletonBar } from '@wds';
import { styled } from 'styled-components';

/**
 * 가계부 리스트 스켈레톤
 * @component
 */
const Skeleton = () => {
  return (
    <SC.Container>
      <SkeletonBar className='title' width='15rem' height='2.6rem' />
      <SkeletonBar className='amount' width='12rem' height='1.95rem' />
      <SkeletonBar className='amount' width='8rem' height='1.95rem' />
    </SC.Container>
  );
};

const SC = {
  Container: styled.section`
    padding: 1rem 1.6rem 0;
    .title {
      margin-bottom: 1.6rem;
    }

    .amount {
      margin-top: 0.5rem;
    }
  `,
};

export default Skeleton;
