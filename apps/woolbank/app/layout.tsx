'use client';

import { Global, ThemeProvider, css } from '@emotion/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { reset_style, theme } from '@wds';
import { Provider } from 'jotai';
import { Suspense } from 'react';
import FullScreenLoading from '../components/common/FullScreenLoading';
import Layout from '../components/layout/Layout';
import { setConfig } from '../utils/config';

const blog_reset_css = css`
  ${reset_style}
  .nanoBarLoading {
    div {
      background: $main-theme-color;
    }
  }
`;
setConfig();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <html lang='ko'>
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
      <Global styles={blog_reset_css} />
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <ThemeProvider theme={theme.light}>
              <Suspense fallback={<FullScreenLoading loading />}>
                <Layout>{children}</Layout>
              </Suspense>
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
        <div id='modalDeem' />
      </body>
    </html>
  );
}
