import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context';
import { ReactNode, Suspense } from 'react';
import { ConfirmProvider } from '../domains/Confirm/ConfirmContext';
import { Layout } from '../domains/layout/Layout';
import { setConfig } from '../utils/config';

setConfig();

const parameters: Preview['parameters'] = {
  nextRouter: {
    Provider: AppRouterContext.Provider, // next 13 next 13 (using next/navigation)
  },
  nextjs: {
    appDirectory: true,
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
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

const decorators: Preview['decorators'] = [];

const withApp = (Story: ReactNode) => {
  const query_client = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, staleTime: 300000, retry: 1 } },
  });

  return (
    <>
      <QueryClientProvider client={query_client}>
        <head>
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
        </head>
        <>
          <Layout>
            <ConfirmProvider>
              <Suspense fallback={<div>로딩중</div>}>
                <Story />
                <div id='modalDeem' />
              </Suspense>
            </ConfirmProvider>
          </Layout>
        </>
      </QueryClientProvider>
    </>
  );
};

decorators.push(withApp);

const preview: Preview = {
  parameters,
  decorators,
};

export default preview;
