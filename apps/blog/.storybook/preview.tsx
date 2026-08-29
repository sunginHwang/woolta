import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../app/global.css';
import '@wds/colors/darkTheme.css';

/**
 * 앱의 components/layout/providers/Providers.tsx 와 같은 컨텍스트를 주입한다.
 * 색상 토큰은 StyleX 가 만든 CSS 변수라 위의 전역 CSS import 로 들어온다.
 */
const withApp: Decorator = (Story) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <>
        <link
          rel='stylesheet'
          as='style'
          crossOrigin=''
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard.css'
        />
        <div>
          <Story />
        </div>
      </>
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
