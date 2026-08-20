'use client';

import { useParams } from 'next/navigation';
import { styled } from 'styled-components';
import { MarkdownViewer } from '../../_shared/mark-down-viewer/MarkdownViewer';
import { usePost } from '../hooks/usePost';

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
