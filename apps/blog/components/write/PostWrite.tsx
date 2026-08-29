'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import { useAtomValue } from 'jotai';
import { MarkdownViewer } from '../common/mark-down-viewer/MarkdownViewer';
import { useTempSavePost } from './hooks/useTempSavePost';
import { useUpsertPost } from './hooks/useUpsertPost';
import { PostEditor } from './post-editor/PostEditor';
import { postAtom } from './store';

const styles = stylex.create({
  container: {
    width: '100%',
    height: 'calc(100vh - 61px)',
    display: 'flex',
  },
  item: {
    display: 'flex',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '0%',
    overflowY: 'scroll',
    position: 'relative',
  },
  viewer: {
    paddingBlock: 0,
    paddingInline: '2rem',
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderLeftColor: colorVars['--color-bgSecondary'],
  },
  writeButton: {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    height: '30px',
    width: '85px',
    borderRadius: '40px',
    backgroundColor: colorVars['--color-bgSecondary'],
    color: colorVars['--color-customGray'],
    borderStyle: 'none',
  },
});

export const PostWrite = () => {
  useTempSavePost();
  const { content, title, category, postNo } = useAtomValue(postAtom);
  const { upsertPost } = useUpsertPost();

  const isUpdatePost = postNo !== null && postNo > 0;

  const handleWriteClick = () => {
    upsertPost({
      title,
      id: postNo ?? 0,
      contents: content,
      categoryNo: Number(category),
      isUpdate: isUpdatePost,
    });
  };

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.item)}>
        <PostEditor />
      </div>
      <div {...stylex.props(styles.item, styles.viewer)}>
        <MarkdownViewer markdown={content} />
        <button {...stylex.props(typographyStyles.body2, styles.writeButton)} onClick={handleWriteClick}>
          {isUpdatePost ? '수정하기' : '작성하기'}
        </button>
      </div>
    </div>
  );
};
