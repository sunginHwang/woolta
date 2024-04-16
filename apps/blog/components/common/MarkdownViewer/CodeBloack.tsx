import { FC } from 'react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import bash from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json';
import jsx from 'react-syntax-highlighter/dist/cjs/languages/prism/jsx';
import markdown from 'react-syntax-highlighter/dist/cjs/languages/prism/markdown';
import scss from 'react-syntax-highlighter/dist/cjs/languages/prism/scss';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import java from 'react-syntax-highlighter/dist/esm/languages/hljs/java';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import style from 'react-syntax-highlighter/dist/esm/styles/hljs/darcula';

SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('json', json);
//SyntaxHighlighter.registerLanguage('javascript', javascript);
//SyntaxHighlighter.registerLanguage('java', java);

interface Props {
  value: string;
  language: string;
  codeEl?: HTMLElement;
}

const CodeBlock: FC<Props> = ({ value, language }) => {
  return (
    <SyntaxHighlighter language={language} style={style}>
      {value === undefined ? '' : value}
    </SyntaxHighlighter>
  );
};

export default CodeBlock;
