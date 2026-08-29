'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useParams } from 'next/navigation';
import { MarkdownViewer } from '../../common/mark-down-viewer/MarkdownViewer';
import { usePost } from '../hooks/usePost';

const styles = stylex.create({
  container: {
    color: colorVars['--color-gray800'],
    wordBreak: 'break-all',
    marginTop: '2rem',
  },
});

export const Content = () => {
  const { categoryNo, postNo } = useParams() as { categoryNo: string; postNo: string };

  const { post } = usePost(categoryNo, postNo);

  if (!post) {
    return null;
  }

  return (
    <div {...stylex.props(styles.container)}>
      <MarkdownViewer markdown={post.content} />
    </div>
  );
};
