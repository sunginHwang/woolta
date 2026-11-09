'use client';
import { AppHostProvider, useSessionExpiredRedirect } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import type { ThemeType } from '@wds';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffect } from 'react';
import { ConfirmProvider } from '../../../components/Confirm/ConfirmContext';
import { THEME_COLOR, themeTypeAtom } from '../../../store/theme';
import { setConfig } from '../../../utils/config';
import { Layout } from '../Layout';

setConfig();

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
 * 세션 만료 감시는 QueryClientProvider 안쪽이어야 한다 — useQueryClient 를 쓴다.
 */
const SessionGuard = ({ children }: { children: React.ReactNode }) => {
  useSessionExpiredRedirect('/user/login');
  return <>{children}</>;
};

interface ThemeHydrationProps {
  /** 서버가 쿠키에서 읽은 초기 테마 */
  initialThemeType: ThemeType;
  children: React.ReactNode;
}

/** 서버가 읽은 테마로 atom 을 초기화해 첫 렌더부터 올바른 테마를 적용한다. */
const ThemeHydration = ({ initialThemeType, children }: ThemeHydrationProps) => {
  useHydrateAtoms([[themeTypeAtom, initialThemeType]]);
  return <>{children}</>;
};

/** 서버 렌더는 layout 이 data-theme 을 지정하고, 클라이언트 토글은 여기서 동기화한다. */
const ThemeSync = () => {
  const themeType = useAtomValue(themeTypeAtom);

  useEffect(() => {
    document.documentElement.dataset.theme = themeType;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[themeType]);
  }, [themeType]);

  return null;
};

interface Props {
  /** 서버가 쿠키에서 읽은 초기 테마 */
  initialThemeType: ThemeType;
  children: React.ReactNode;
}

export const RootProvider = ({ initialThemeType, children }: Props) => {
  const queryClient = getQueryClient();

  return (
    <AppHostProvider appHost='woolbank'>
      <QueryClientProvider client={queryClient}>
        <SessionGuard>
          <ReactQueryStreamedHydration>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            <JotaiProvider>
              <ThemeHydration initialThemeType={initialThemeType}>
                <ThemeSync />
                <ConfirmProvider>
                  <Layout>{children}</Layout>
                </ConfirmProvider>
              </ThemeHydration>
            </JotaiProvider>
          </ReactQueryStreamedHydration>
        </SessionGuard>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
