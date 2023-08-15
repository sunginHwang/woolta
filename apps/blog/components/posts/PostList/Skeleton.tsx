import styled from "@emotion/styled";
import layouts from "apps/blog/style/layouts";
import { makeArray } from "apps/blog/utils/array-utils";
import SkeletonBar from "../../base/SkeletonBar";


function PostListSkeleton() {
  return (
    <SC.Container>
      {[makeArray(10).map(index => <SkeletonBar key={index} />)]}
    </SC.Container>
  )
}

export default PostListSkeleton;


const SC = {
  Container: styled.div`
    margin-top: 2em;
    max-width: ${layouts.contentMaxWidth};
    margin: 0 auto;

  @media screen and (max-width: ${layouts.mobileWidth}){
    padding-left: 2rem;
    padding-right: 2rem;
  }

  @media screen and (max-width: ${layouts.phoneWidth}){
    padding-left: 1rem;
    padding-right: 1rem;
  }
  `,
}
