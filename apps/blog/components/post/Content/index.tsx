import { styled } from 'styled-components';
import MarkdownViewer from '../../common/MarkdownViewer';
import { usePost } from '../hooks/usePost';

const Content = () => {
  const { post } = usePost();

  if (!post) {
    return null;
  }

  return (
    <SC.Container>
      <MarkdownViewer markdown={post.content} />
    </SC.Container>
  );
};

export default Content;

const SC = {
  Container: styled.div`
    color: ${({ theme }) => theme.colors.gray800} !important;
    word-break: break-all;
  `,
};
