import styled from '@emotion/styled';
import { javascript } from '@codemirror/lang-javascript';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { useCodeMirror } from '@uiw/react-codemirror';
import { useEffect, useRef, useState } from 'react';
import { useImageDndAndPaste } from '../hooks/useImageDndAndPaste';
import { themeCss } from './theme';
import { splitWithIndex } from 'apps/blog/utils/StringUtil';
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language';
import { useAtom } from 'jotai';
import { postAtom } from '../store';

const UPLOAD_PREV_TEXT = `![업로드중..]()\n`;

const code = `## Title

\`\`\`jsx
function Demo() {
  return <div>demo</div>
}
\`\`\`

\`\`\`bash
# Not dependent on uiw.
npm install @codemirror/lang-markdown --save
npm install @codemirror/language-data --save
\`\`\`

[weisit ulr](https://uiwjs.github.io/react-codemirror/)

\`\`\`go
package main
import "fmt"
func main() {
  fmt.Println("Hello, 世界")
}
\`\`\`
`;

const Editor = () => {
  const editor = useRef(null);
  const [value, setValue] = useAtom(postAtom);
  const { view, setContainer } = useCodeMirror({
    container: editor.current,
    extensions: [[markdown({ base: markdownLanguage }), javascript(), syntaxHighlighting(defaultHighlightStyle)]],
    value: value,
    onChange: setValue,
  });

  const updateImage = (image: string) => {
    setValue((prev) => prev.replace(UPLOAD_PREV_TEXT, image));
  };

  const addUploadLoadingText = () => {
    const currentFocusIndex = view?.state?.selection.main.head;
    if (currentFocusIndex !== undefined) {
      const [prevText, nextText] = splitWithIndex(value, currentFocusIndex);
      setValue(prevText + UPLOAD_PREV_TEXT + nextText);
      return;
    }

    setValue(`\n${value}${UPLOAD_PREV_TEXT}`);
  };

  useImageDndAndPaste({
    onUpdating: addUploadLoadingText,
    onUpdateImage: updateImage,
  });

  useEffect(() => {
    if (editor.current) {
      setContainer(editor.current);
    }
  }, [editor.current]);

  return (
    <div>
      <SC.TextEditor css={themeCss} ref={editor} />
    </div>
  );
};

export default Editor;

const SC = {
  TextEditor: styled.div`
    min-height: 0px;
    flex: 1 1 0%;
    text-align: left;
  `,
};
