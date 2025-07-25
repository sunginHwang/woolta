import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
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

  /* 모든 DOM 요소에 대해 클릭 및 포커스 시 스타일 제거 */
  * {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

`;
