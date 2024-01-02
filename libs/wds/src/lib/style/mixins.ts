import { css } from '@emotion/react';

export const invisibleScrollBar = css`
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const safeAreaInsetBottom = (value: string) => css`
  bottom: ${value};
  bottom: calc(constant(safe-area-inset-bottom) + ${value});
  bottom: calc(env(safe-area-inset-bottom) + ${value});
`;

export const safeAreaInsetMarginBottom = (value: string) => css`
  margin-bottom: ${value};
  margin-bottom: calc(constant(safe-area-inset-bottom) + ${value});
  margin-bottom: calc(env(safe-area-inset-bottom) + ${value});
`;
