import styled from '@emotion/styled';
import Editor from './Editor';
import MarkdownViewer from '../common/MarkdownViewer';
import { useAtomValue } from 'jotai';
import { postAtom } from './store';

const Write = () => {
  const post = useAtomValue(postAtom);
  return (
    <SC.Container className='test'>
      <div className='item'>
        <Editor />
      </div>
      <div className='item'>
        <MarkdownViewer markdown={post} />
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
    }
  `,
};
