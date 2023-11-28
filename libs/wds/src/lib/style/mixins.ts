import { css } from '@emotion/react';

export const invisibleScrollBar = css`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
