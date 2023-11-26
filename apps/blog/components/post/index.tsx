import styled from '@emotion/styled';
import layouts from 'apps/blog/style/layouts';
import Content from './Content';
import Title from './Title';

const Post = () => {
  return (
    <SC.Container>
      <Title />
      <Content />
    </SC.Container>
  );
};

export default Post;

const SC = {
  Container: styled.div`
    text-align: left;
    margin-top: 3.2rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      padding: 0 2rem 0 2rem;
    }

    @media screen and (max-width: ${layouts.phoneWidth}) {
      padding: 0 1.6rem 0 1.6rem;
    }
  `,
};
