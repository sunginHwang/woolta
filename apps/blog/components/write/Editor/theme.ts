import { css } from 'styled-components';

export const themeCss = css`
  .cm-s-one-light {
    font-size: 12px;
    line-height: 18px;
    color: #50a14f;
    background-color: #fff;
  }
  .cm-s-one-light .CodeMirror-selected {
    background-color: rgba(0, 0, 0, 0.125);
  }
  .cm-s-one-light .CodeMirror-gutter,
  .cm-s-one-light .CodeMirror-gutters {
    border: none;
    background-color: #fff;
  }
  .cm-s-one-light .CodeMirror-linenumber,
  .cm-s-one-light .CodeMirror-linenumbers {
    color: #9d9d9f !important;
    background-color: transparent;
  }
  .cm-s-one-light .CodeMirror-lines {
    /* color: #383a42 !important; */
    background-color: transparent;
  }
  .cm-s-one-light .CodeMirror-cursor {
    /* border-left: 2px solid #56b6c2 !important; */
  }
  /* addon: edit/machingbrackets.js & addon: edit/matchtags.js */
  .cm-s-one-light .CodeMirror-matchingbracket,
  .cm-s-one-light .CodeMirror-matchingtag {
    border-bottom: 2px solid #56b6c2;
    color: #383a42 !important;
    background-color: transparent;
  }
  .cm-s-one-light .CodeMirror-nonmatchingbracket {
    border-bottom: 2px solid #e06c75;
    /* color: #383a42 */
    background-color: transparent;
  }
  /* addon: fold/foldgutter.js */
  .cm-s-one-light .CodeMirror-foldmarker,
  .cm-s-one-light .CodeMirror-foldgutter,
  .cm-s-one-light .CodeMirror-foldgutter-open,
  .cm-s-one-light .CodeMirror-foldgutter-folded {
    border: none;
    text-shadow: none;
    color: #9d9d9f !important;
    background-color: transparent;
  }
  /* addon: selection/active-line.js */
  .cm-s-one-light .CodeMirror-activeline-background {
    /*background-color: rgba(153, 187, 255, 0.04);*/
    background-color: #000;
  }

  /* basic syntax */
  .cm-s-one-light .cm-header {
    color: #e06c75;
  }
  .cm-s-one-light .cm-quote {
    color: #9d9d9f;
    font-style: italic;
  }
  .cm-s-one-light .cm-negative {
    color: #e06c75;
  }
  .cm-s-one-light .cm-positive {
    color: #e06c75;
  }
  .cm-s-one-light .cm-strong {
    color: #e45649;
    font-weight: bold;
  }
  .cm-s-one-light .cm-header .cm-strong {
    color: #e45649;
    font-weight: bold;
  }
  .cm-s-one-light .cm-em {
    color: #c678dd;
    font-style: italic;
  }
  .cm-s-one-light .cm-header .cm-em {
    color: #c678dd;
    font-style: italic;
  }
  .cm-s-one-light .cm-tag {
    color: #e45649;
  }
  .cm-s-one-light .cm-attribute {
    color: #986801;
  }
  .cm-s-one-light .cm-link {
    color: #50a14f;
    border-bottom: solid 1px #50a14f;
  }
  .cm-s-one-light .cm-builtin {
    color: #e06c75;
  }
  .cm-s-one-light .cm-keyword {
    color: #0184bc;
  }
  .cm-s-one-light .cm-def {
    color: #cf9d41;
  } /* original:  #e45649; */
  .cm-s-one-light .cm-atom {
    color: #0184bc;
  }
  .cm-s-one-light .cm-number {
    color: #986801;
  }
  .cm-s-one-light .cm-property {
    color: #e45649;
  } /* original: #383a42 */
  .cm-s-one-light .cm-qualifier {
    color: #e45649;
  }
  .cm-s-one-light .cm-variable {
    color: #e06c75;
  }
  .cm-s-one-light .cm-string {
    color: #50a14f;
  }
  .cm-s-one-light .cm-punctuation {
    color: #383a42;
  }
  .cm-s-one-light .cm-operator {
    color: #56b6c2;
  } /* original: #383a42 */
  .cm-s-one-light .cm-meta {
    color: #808080;
  }
  .cm-s-one-light .cm-bracket {
    color: #383a42;
  }
  .cm-s-one-light .cm-comment {
    color: #9d9d9f;
    font-style: italic;
  }
  .cm-s-one-light .cm-error {
    color: #e06c75;
  }
  /* css syntax corrections */
  .cm-s-one-light .cm-m-css.cm-variable {
    color: #828997;
  }
  .cm-s-one-light .cm-m-css.cm-property {
    color: #383a42;
  }
  .cm-s-one-light .cm-m-css.cm-atom {
    color: #0184bc;
  }
  .cm-s-one-light .cm-m-css.cm-builtin {
    color: #56b6c2;
  }
  /* lua syntax corrections */
  .cm-s-one-light .cm-m-lua.cm-variable {
    color: #56b6c2;
  }
`;
