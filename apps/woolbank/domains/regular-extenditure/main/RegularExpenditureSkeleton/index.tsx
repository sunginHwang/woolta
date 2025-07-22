import { SkeletonBar } from '@wds';
import { styled } from 'styled-components';

/**
 * 정기 지출 리스트 -> 리스트 페이지 로딩 스켈레톤
 * @component
 */
const RegularExpenditureSkeleton = () => {
  return (
    <SC.Container>
      <SC.Title>
        <SkeletonBar width='100%' height='5.4rem' />
      </SC.Title>
      <SC.OneWeek>
        <SkeletonBar width='20.4rem' height='2.2rem' />
        <SkeletonBar width='100%rem' height='4.3rem' />
      </SC.OneWeek>
      <SC.Line />
      <SC.List>
        <SC.ListTop>
          <SkeletonBar width='6rem' height='2.1rem' />
          <SkeletonBar width='7rem' height='2.1rem' />
        </SC.ListTop>
        <SC.ListContent>
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
        </SC.ListContent>
      </SC.List>
      <SC.List>
        <SC.ListTop>
          <SkeletonBar width='6rem' height='2.1rem' />
          <SkeletonBar width='7rem' height='2.1rem' />
        </SC.ListTop>
        <SC.ListContent>
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
          <SkeletonBar width='100%' height='6.5rem' />
        </SC.ListContent>
      </SC.List>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    padding: 3rem 1.6rem;
  `,
  ListContent: styled.div`
    margin-top: 1rem;
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.colors.gray100};
    height: 0.7rem;

    margin-top: 2rem;
  `,
  ListTop: styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  `,
  List: styled.div`
    margin-top: 3rem;
  `,
  Title: styled.div`
    margin: 1rem 0 2rem 0;
  `,
  OneWeek: styled.div`
    div {
      &:first-child {
        margin-bottom: 1.5rem;
      }
    }
  `,
};

export default RegularExpenditureSkeleton;
