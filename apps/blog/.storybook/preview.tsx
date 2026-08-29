import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@wds';
import { ThemeProvider } from 'styled-components';

/**
 * 앱의 components/layout/providers/Providers.tsx 와 같은 컨텍스트를 주입한다.
 * 이전 preview 는 폐기된 @storybook/addon-styling 의 withThemeFromJSXProvider 를
 * GlobalStyles 만 넘겨 호출했던 탓에 테마도 쿼리 클라이언트도 비어 있었다.
 */
const withApp: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme.light}>
        <link
          rel='stylesheet'
          as='style'
          crossOrigin=''
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css'
        />
        <div>
          <Story />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    // useRouter 를 쓰는 컴포넌트가 App Router 컨텍스트를 찾을 수 있게 한다
    nextjs: { appDirectory: true },
  },
  decorators: [withApp],
};

export default preview;
