'use client';

import { AppHostProvider } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfirmProvider, type ThemeType } from '@wds';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffect } from 'react';
import AppShell from '../app-shell/AppShell';
import { themeTypeAtom } from '../store';

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
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

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

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  const themeType = useAtomValue(themeTypeAtom);

  // 서버 렌더는 layout 이 data-theme 을 지정하고, 클라이언트 토글은 여기서 동기화한다.
  useEffect(() => {
    document.documentElement.dataset.theme = themeType;
  }, [themeType]);

  return (
    <ConfirmProvider>
      <AppShell>{children}</AppShell>
    </ConfirmProvider>
  );
};

interface Props {
  /** 서버가 쿠키에서 읽은 초기 테마 */
  initialThemeType: ThemeType;
  children: React.ReactNode;
}

export const Providers = ({ initialThemeType, children }: Props) => {
  const queryClient = getQueryClient();

  return (
    <AppHostProvider appHost='woolta'>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <ThemeHydration initialThemeType={initialThemeType}>
            <ThemedApp>{children}</ThemedApp>
          </ThemeHydration>
        </JotaiProvider>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
