import { javascript } from '@codemirror/lang-javascript';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { languages } from '@codemirror/language-data';
import { styled } from 'styled-components';
import { useCodeMirror } from '@uiw/react-codemirror';
import { splitWithIndex } from 'apps/blog/utils/string';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { useImageDndAndPaste } from '../hooks/useImageDndAndPaste';
import { postContentAtom } from '../store';
import { themeCss } from './theme';

const UPLOAD_PREV_TEXT = `![업로드중..]()\n`;
const CONTENT_PLACEHOLDER = '멋진 글을 공유해 주세요.';

const Content = () => {
  const editorRef = useRef(null);
  const [postContent, setPostContent] = useAtom(postContentAtom);
  const { view, setContainer } = useCodeMirror({
    container: editorRef.current,
    placeholder: CONTENT_PLACEHOLDER,
    basicSetup: {
      autocompletion: true,
      searchKeymap: true,
      closeBrackets: true,
      closeBracketsKeymap: true,
      highlightActiveLine: true,
      completionKeymap: true,
      lineNumbers: false,
      foldGutter: false,
    },
    extensions: [
      [
        markdown({ base: markdownLanguage, codeLanguages: languages }),
        javascript(),
        syntaxHighlighting(defaultHighlightStyle),
      ],
    ],
    value: postContent,
    onChange: setPostContent,
  });

  const updateImage = (image: string) => {
    setPostContent((prev) => prev.replace(UPLOAD_PREV_TEXT, image));
  };

  const addUploadLoadingText = () => {
    const currentFocusIndex = view?.state?.selection.main.head;
    if (currentFocusIndex !== undefined) {
      const [prevText, nextText] = splitWithIndex(postContent, currentFocusIndex);
      setPostContent(prevText + UPLOAD_PREV_TEXT + nextText);
      return;
    }

    setPostContent(`\n${postContent}${UPLOAD_PREV_TEXT}`);
  };

  useImageDndAndPaste({
    onUpdating: addUploadLoadingText,
    onUpdateImage: updateImage,
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [editorRef.current]);

  return <SC.Container ref={editorRef} />;
};

export default Content;

const SC = {
  Container: styled.div`
    ${themeCss}
    width: 100%;
    height: 100%;
    text-align: left;

    .CodeMirror-wrap pre {
      word-break: break-word;
    }
    .cm-scroller {
      font-family: 'Pretendard', 'sans-serif';
    }

    .cm-line {
      word-wrap: break-word;
      white-space: pre-wrap;
      word-break: normal;
    }

    .cm-editor {
      height: 100%;
      padding: 0 16px;
    }

    .cm-content {
      white-space: pre-wrap;
    }

    .cm-focused {
      outline: none;
    }
  `,
};
