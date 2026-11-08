import type { Decorator, Preview } from '@storybook/react-vite';
import { useEffect } from 'react';
// 순서는 앱 layout.tsx 와 같다: 다크 토큰 → StyleX 추출 CSS(@stylex) → 전역 스타일
import '@wds/colors/darkTheme.css';
import './stylex.css';
import './preview.css';

type ThemeType = 'light' | 'dark';

/** 툴바의 테마 선택을 앱과 같은 방식(html[data-theme])으로 반영한다 */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? 'light') as ThemeType;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <Story />;
};

const preview: Preview = {
  // 모든 컴포넌트 스토리에 Docs 탭을 자동 생성한다 (Title/Description/Primary/Controls/Stories)
  tags: ['autodocs'],
  globalTypes: {
    theme: {
      description: '라이트/다크 테마',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: [
          'Intro',
          'Foundations',
          ['Colors', 'Typography', 'Icons', 'Shadows', 'Z-Index'],
          'Components',
          'Utilities',
        ],
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
