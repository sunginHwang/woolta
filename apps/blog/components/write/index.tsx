import styled from '@emotion/styled';
import { typography } from 'apps/blog/style/font';
import { useAtomValue } from 'jotai';
import MarkdownViewer from '../common/MarkdownViewer';
import Editor from './Editor';
import { useTempSavePost } from './hooks/useTempSavePost';
import { useUpsertPost } from './hooks/useUpsertPost';
import { postAtom } from './store';

const Write = () => {
  useTempSavePost();
  const { content, title, category, postNo } = useAtomValue(postAtom);
  const { upsertPost } = useUpsertPost();

  const handleWriteClick = () => {
    upsertPost({
      title,
      id: postNo ?? 0,
      contents: content,
      categoryNo: Number(category),
    });
  };

  return (
    <SC.Container className='test'>
      <div className='item'>
        <Editor />
      </div>
      <div className='item viewer'>
        <MarkdownViewer markdown={content} />
        <button className='button' onClick={handleWriteClick}>
          작성하기
        </button>
      </div>
    </SC.Container>
  );
};

export default Write;

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
      border-left: 1px solid ${({ theme }) => theme.colors.bgSecondary};
    }
  `,
};
