'use client';

import { typography } from '@wds';
import { useAtomValue } from 'jotai';
import { styled } from 'styled-components';
import { MarkdownViewer } from '../common/mark-down-viewer/MarkdownViewer';
import { useTempSavePost } from './hooks/useTempSavePost';
import { useUpsertPost } from './hooks/useUpsertPost';
import { PostEditor } from './post-editor/PostEditor';
import { postAtom } from './store';

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
    <SC.Container className='test'>
      <div className='item'>
        <PostEditor />
      </div>
      <div className='item viewer'>
        <MarkdownViewer markdown={content} />
        <button className='button' onClick={handleWriteClick}>
          {isUpdatePost ? '수정하기' : '작성하기'}
        </button>
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    width: 100%;
    height: calc(100vh - 61px);
    display: flex;

    .item {
      display: flex;
      flex: 1 1 0%;
      overflow-y: scroll;
      position: relative;
    }

    .button {
      ${typography.body2}
      position: absolute;
      bottom: 16px;
      right: 16px;
      height: 30px;
      width: 85px;
      border-radius: 40px;
      background-color: ${({ theme }) => theme.colors.bgSecondary};
      color: ${({ theme }) => theme.colors.customGray};
      border: none;
    }

    .viewer {
      padding: 0 2rem;
      border-left: 1px solid ${({ theme }) => theme.colors.bgSecondary};
    }
  `,
};
