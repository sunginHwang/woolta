'use client';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { theme } from 'libs/wds/src/lib/style/colors';
import { useState } from 'react';
import Layout from '../Layout';
import StyleRegistry from './StyleRegistry';
import { ConfirmProvider } from '../../common/Confirm/ConfirmContext';
import { setConfig } from '../../../utils/config';
import { Suspense } from '@wds';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
setConfig();

const GlobalStyles = createGlobalStyle`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
  }

  html {
    font-size: 62.5%;
    font-family: 'Pretendard', 'sans-serif';
    scroll-behavior: smooth;
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-size: 1.6rem;
    line-height: 1.5;
    display: flex;
    flex-direction: column;
  }

  ol,
  ul,
  li {
    list-style: none;
    margin: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  body > div:first-of-type,
  #__next {
    height: 100%;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  ol,
  ul,
  li {
    list-style: none;
    margin: 0;
  }

  a {
    text-decoration: none;
  }

  a:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -webkit-border-radius: 0;
  }
  input:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-appearance: none;
    -webkit-border-radius: 0;
  }
  textarea:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  [role='button'],
  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  button {
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
  }

  /* Reset \`button\` and button-style \`input\` default styles */
  input[type='submit'],
  input[type='reset'],
  input[type='button'],
  button {
    background: none;
    border: 0;
    color: inherit;
    /* cursor: default; */
    font: inherit;
    line-height: normal;
    overflow: visible;
    padding: 0;
    -webkit-appearance: button; /* for input */
    -webkit-user-select: none; /* for button */
    -moz-user-select: none;
    -ms-user-select: none;
  }

  button:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }
  input::-moz-focus-inner,
  button::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  input[type='range'] {
    width: 100%;
    -webkit-appearance: none;
    background: transparent;
  }
  input[type='range']:focus {
    outline: none;
  }
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
  }

  /* Make \`a\` like a button */
  [role='button'] {
    color: inherit;
    cursor: default;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    white-space: pre;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  /* a 태그와 button 태그 클릭 시 나타나는 스타일 제거 */
  a, button {
    outline: none; /* 포커스 아웃라인 제거 */
  }

  a:focus, button:focus {
    outline: none; /* 포커스 상태에서 아웃라인 제거 */
  }

  a:active, button:active {
    background-color: transparent; /* 활성화 상태 배경색 제거 */
    border: none; /* 활성화 상태 테두리 제거 */
    box-shadow: none; /* 활성화 상태 박스 쉐도우 제거 */
  }

  /* 추가적으로 웹 브라우저 기본 스타일 제거 */
  a:focus-visible, button:focus-visible {
    outline: none; /* 포커스 상태에서 보이는 아웃라인 제거 */
  }
`;

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          <ReactQueryDevtools />
          <JotaiProvider>
            <StyleRegistry>
              <ThemeProvider theme={theme.light}>
                <GlobalStyles />
                <ConfirmProvider>
                  <Layout>{children}</Layout>
                </ConfirmProvider>
              </ThemeProvider>
            </StyleRegistry>
          </JotaiProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </>
  );
};
