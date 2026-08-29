import type { FC } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/prism/tomorrow';
import rehypeRaw from 'rehype-raw';
import viewerCss from './markdownViewer.module.css';

interface Props {
  markdown: string;
}

export const MarkdownViewer: FC<Props> = ({ markdown }) => {
  return (
    <div className={viewerCss.viewer}>
      <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter language={match[1]} style={tomorrow} PreTag='div'>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code {...props}>{children}</code>
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
};
