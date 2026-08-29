import type { Decorator, Preview } from '@storybook/nextjs-vite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ConfirmProvider } from '../components/Confirm/ConfirmContext';
import { Layout } from '../domains/layout/Layout';
import { setConfig } from '../utils/config';

setConfig();

const parameters: Preview['parameters'] = {
  // App Router 컨텍스트는 @storybook/nextjs-vite 가 주입한다.
  // (이전의 nextRouter.Provider 수동 주입은 Next 16 에서 경로가 사라진 내부 모듈에 의존했다)
  nextjs: {
    appDirectory: true,
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      order: ['pages', '*'],
    },
  },
};

// link/meta 는 React 19 가 자동으로 <head> 로 끌어올린다 — 본문의 <head> 래퍼는 제거했다
const withApp: Decorator = (Story) => {
  const query_client = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 300000, retry: 1 } },
  });

  return (
    <QueryClientProvider client={query_client}>
      <meta charSet='utf-8' />
      <link rel='icon' href='/static/woolta.ico' type='icon' />
      <link rel='apple-touch-icon-precomposed' href='/static/woolta.ico' />
      <link rel='icon' type='icon' href='/static/woolta.ico' sizes='196x196' />
      <link rel='icon' type='icon' href='/static/woolta.ico' sizes='96x96' />
      <link rel='icon' type='icon' href='/static/woolta.ico' sizes='32x32' />
      <link rel='icon' type='icon' href='/static/woolta.ico' sizes='16x16' />
      <link rel='icon' type='icon' href='/static/woolta.ico' sizes='128x128' />
      <link rel='apple-touch-icon' href='/static/woolta.ico' />
      <link rel='shortcut icon' href='/static/woolta.ico' />
      <link rel='manifest' href='/manifest.json' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='theme-color' content='#fff' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='white' />
      <meta name='description' content='woolta 블로그 ver2.0 기술 개발 블로그' />
      <meta property='og:description' content='woolta 블로그 ver2.0 기술 개발 블로그' />
      <meta property='og:site_name' content='woolta Blog' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover'
      />
      <meta name='google-site-verification' content='mHu43Zp59l_qzcOGtYILaM-tIH-mPKepPuYxRwbIqbs' />
      <link
        rel='stylesheet'
        as='style'
        crossOrigin=''
        href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.8/dist/web/static/pretendard-dynamic-subset.css'
      />
      <Layout>
        <ConfirmProvider>
          <Suspense fallback={<div>로딩중</div>}>
            <Story />
            <div id='modalDeem' />
          </Suspense>
        </ConfirmProvider>
      </Layout>
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters,
  decorators: [withApp],
};

export default preview;
