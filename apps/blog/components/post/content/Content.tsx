'use client';
import { styled } from 'styled-components';
import { MarkdownViewer } from '../../common/mark-down-viewer/MarkdownViewer';
import { usePost } from '../hooks/usePost';
import { useParams } from 'next/navigation';

export const Content = () => {
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };

  const { post } = usePost(categoryNo, postNo);

  if (!post) {
    return null;
  }

  return (
    <SC.Container>
      <MarkdownViewer markdown={post.content} />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    color: ${({ theme }) => theme.colors.gray800} !important;
    word-break: break-all;
    margin-top: 2rem;
  `,
};
