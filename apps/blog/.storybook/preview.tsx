import { Global } from '@emotion/react';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { reset_style } from '../style/reset';

const GlobalStyles = () => (
  <>
    <link
      rel='stylesheet'
      as='style'
      crossOrigin=''
      href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css'
    />
    <Global styles={reset_style} />
  </>
);

export const decorators = [
  withThemeFromJSXProvider({
    GlobalStyles, // Adds your GlobalStyles component to all stories
  }),
];
