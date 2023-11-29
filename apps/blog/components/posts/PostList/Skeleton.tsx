import styled from '@emotion/styled';
import { SkeletonBar } from '@wds';
import layouts from 'apps/blog/style/layouts';
import { makeArray } from 'apps/blog/utils/array-utils';

function PostListSkeleton() {
  return (
    <SC.Container>
      {[
        makeArray(10).map((index) => (
          <SC.PostItem key={index}>
            <SC.Line>
              <SkeletonBar width='65%' height='2.88rem' />
            </SC.Line>
            <SC.Line>
              <SkeletonBar width='60%' height='1.7rem' />
              <SkeletonBar width='80%' height='1.7rem' />
              <SkeletonBar width='40%' height='1.7rem' />
            </SC.Line>
            <SC.Line>
              <SkeletonBar width='15%' height='1.28rem' />
            </SC.Line>
          </SC.PostItem>
        )),
      ]}
    </SC.Container>
  );
}

export default PostListSkeleton;

const SC = {
  Container: styled.div`
    margin-top: 2em;
    max-width: ${layouts.contentMaxWidth};
    margin: 0 auto;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      padding-left: 2rem;
      padding-right: 2rem;
    }

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding-left: 1rem;
      padding-right: 1rem;
    }
  `,
  PostItem: styled.div`
    text-align: left;
    padding-bottom: 1em;
    padding-top: 1.7em;
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray600};

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding-bottom: 0.5em;
      padding-top: 1.2em;
    }
  `,
  Line: styled.div`
    margin-bottom: 1.5rem;
  `,
};
