declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}

/* 전역 CSS 의 side-effect import (예: darkTheme.css, 스토리북 preview.css) */
declare module '*.css';
