import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { StoryFn, StoryContext, Decorator } from '@storybook/react';

const GlobalStyles = () => (
  <link
    rel='stylesheet'
    as='style'
    crossOrigin=''
    href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css'
  />
);

const ThemeDecorator: Decorator = (Story: StoryFn, context: StoryContext) => {
  return <div>{Story({}, context)}</div>;
};

export { ThemeDecorator };

export const decorators = [
  ThemeDecorator,
  withThemeFromJSXProvider({
    GlobalStyles, // Adds your GlobalStyles component to all stories
  }),
];
