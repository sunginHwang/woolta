'use client';

import { BlogRoutesContext, setBlogConfig } from '@blog/features';
import { AppHostProvider, useSessionExpiredRedirect } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import config, { setConfig } from '../../../utils/config';
import Layout from '../Layout';

setConfig();

// blog 앱은 자기 도메인 루트에 붙으므로 basePath 가 없다(대시보드는 '/blog').
const BLOG_BASE_PATH = '';

setBlogConfig({
  imageApiUrl: config.imageApiUrl,
  tempPostAutoSaveKey: config.tempPostAutoSave,
  thumbnailImageUrl: config.blogThumbnailImageUrl,
});

/**
 * 세션 만료 감시.
 *
 * blog 읽기는 비인증이라 걸리지 않는다 — 글 저장·삭제처럼 인증이 필요한 요청이
 * 만료된 세션으로 나갈 때만 로그인 화면으로 보낸다.
 */
const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_URL ?? 'https://bank.woolta.com/user/login';

const SessionGuard = () => {
  useSessionExpiredRedirect(LOGIN_URL);
  return null;
};

let browserQueryClient: QueryClient | undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

/**
 * BlogScreensProvider 는 쓰지 않는다 — 그쪽은 NotificationBar 를 직접 렌더하는데
 * 이 앱은 Layout 이 이미 렌더하고 있어 토스트가 두 번 뜬다. 라우트 컨텍스트만 가져다 쓴다.
 */
export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <AppHostProvider appHost='blog'>
      <QueryClientProvider client={queryClient}>
        <SessionGuard />
        <JotaiProvider>
          <BlogRoutesContext.Provider value={{ basePath: BLOG_BASE_PATH }}>
            <Layout>{children}</Layout>
          </BlogRoutesContext.Provider>
        </JotaiProvider>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
