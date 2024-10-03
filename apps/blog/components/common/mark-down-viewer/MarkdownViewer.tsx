import { FC } from 'react';
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import tomorrow from 'react-syntax-highlighter/dist/esm/styles/prism/tomorrow';
import { styled } from 'styled-components';
import layouts from '../../../style/layouts';
import rehypeRaw from 'rehype-raw';

interface Props {
  markdown: string;
}

export const MarkdownViewer: FC<Props> = ({ markdown }) => {
  return (
    <SC.Viewer>
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
    </SC.Viewer>
  );
};

const SC = {
  Viewer: styled.div`
    flex: 1 1 0%;
    overflow-y: auto;
    text-align: left;

    p,
    ol,
    ul,
    dl {
      margin-bottom: 1.6rem;
    }

    li {
      display: list-item;
      text-align: -webkit-match-parent;
      list-style-position: inside;
      list-style-type: disc;
    }

    pre {
      border-radius: 6px;
      margin-bottom: 1.6rem;

      > div {
        border-radius: 6px;
      }

      code {
        font-size: 1.3rem;
        border-radius: 0.8rem;
        font-family: 'Pretendard', 'sans-serif' !important;
      }
    }

    iframe,
    img,
    embed,
    object,
    video {
      max-width: 90%;
      display: block;
      margin: 0 auto;
      margin-top: 4.8rem;
      margin-bottom: 4.8rem;
      pointer-events: none;
    }

    blockquote {
      color: ${({ theme }) => theme.colors.bgSecondary};
      margin-top: 3.2rem;
      margin-bottom: 3.2rem;
      padding: 1.6rem 1.5rem 1.6rem 1.5rem;
      border-left: 0.8rem ${({ theme }) => theme.colors.gray300} solid;
      @media screen and (max-width: ${layouts.phoneWidth}) {
        font-size: 1.6rem;
      }

      :first-of-type {
        margin: 0;
      }

      :last-of-type {
        margin: 0;
      }

      p {
        margin: 0;
      }
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
      margin: 1.6rem 0;
    }

    td,
    th {
      padding: 0;
    }

    p,
    ol,
    ul,
    dl {
      font-weight: 400;
      font-size: 11pt;
      line-height: 22pt;
      color: ${({ theme }) => theme.colors.gray700};
    }

    p + p {
      margin-top: 2.4rem;
    }

    li p {
      display: inline;
      line-height: 2.8rem;
      font-weight: 400;
    }

    ul > li,
    li > ul,
    li > ol {
      margin-bottom: 0;
      margin-left: 1.6rem;
    }

    ul {
      list-style-position: inside;
      list-style-type: disc;
    }

    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1.6rem;
      margin-block-end: 1.6rem;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 4rem;
    }

    p,
    li {
      @media screen and (max-width: ${layouts.phoneWidth}) {
        font-size: 1.6rem;
      }
    }

    hr {
      border: 0;
      border-top: 0.1rem solid rgba(0, 0, 0, 0.1);
      border-bottom: 0.1rem solid ${({ theme }) => theme.colors.white};
      margin: 1.6rem 0;
    }

    a {
      color: ${({ theme }) => theme.colors.pink600};
      text-decoration: none;
    }

    strong {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray800};

      code {
        color: ${({ theme }) => theme.colors.green200};
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 2.8rem;
      color: ${({ theme }) => theme.colors.gray800};
      margin-top: 3.6rem;
      margin-bottom: 1.6rem;

      & code {
        font-weight: 600;
      }
    }

    h1 a,
    h2 a,
    h3 a,
    h4 a,
    h5 a,
    h6 a {
      color: ${({ theme }) => theme.colors.graySecondary};
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
      code {
        font-size: 1.3rem;
        padding: 0.326rem 0.39rem;
        border-radius: 0.8rem;
        background-color: ${({ theme }) => theme.colors.bgSecondary};
        border: 0.1rem solid ${({ theme }) => theme.colors.gray400};
        margin: 0 0.4rem;
      }
    }

    h1 {
      font-size: 3.6rem;
      line-height: 4.6rem;
      margin-top: 7rem;
      margin-bottom: 3rem;
      font-weight: 600;
    }

    h2 {
      margin-top: 5rem;
      margin-bottom: 1.5rem;
      font-weight: 600;
      font-size: 2.8rem;
      border-bottom: 0.1rem solid ${({ theme }) => theme.colors.gray300};
      line-height: 1.3;
      padding-bottom: 1rem;
    }

    h3 {
      font-size: 2rem;
      margin-top: 4.6rem;
      margin-bottom: 2rem;
      font-weight: 600;
    }

    tr {
      border-top: 0.1rem solid ${({ theme }) => theme.colors.grayTertiary};
      background: ${({ theme }) => theme.colors.white};
    }

    th,
    td {
      padding: 0.6rem 1.3rem;
      border: 0.1rem solid ${({ theme }) => theme.colors.grayTertiary};
    }

    table tr:nth-of-type(2n) {
      background: ${({ theme }) => theme.colors.gray400};

      /* 마크다운 뷰어 첫줄 패딩 이슈 처리 */
      pre {
        code {
          padding: 0;
        }
      }
    }
  `,
};
