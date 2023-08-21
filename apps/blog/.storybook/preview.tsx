import { Global } from '@emotion/react';
import { StoryFn, StoryContext, Decorator } from '@storybook/react';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { reset_style } from '../style/reset';
import { theme } from '../style/colors';

import { ThemeProvider } from '@emotion/react';
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

const ThemeDecorator: Decorator = (Story: StoryFn, context: StoryContext) => {
  return <ThemeProvider theme={theme.dark}>{Story({}, context)}</ThemeProvider>;
};

export { ThemeDecorator };

export const decorators = [
  ThemeDecorator,
  withThemeFromJSXProvider({
    GlobalStyles, // Adds your GlobalStyles component to all stories
  }),
];
