'use client';

import { AppHostProvider } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfirmProvider, darkThemeCssVariables, theme, type ThemeType } from '@wds';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffect } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import AppShell from '../app-shell/AppShell';
import { themeTypeAtom } from '../store';
import StyleRegistry from './StyledComponentsRegistry';

const GlobalStyles = createGlobalStyle`
  /* 테마는 html[data-theme] 가 결정한다 — 다크는 WDS 토큰(CSS 변수) 재정의로 적용 */
  :root {
    color-scheme: light;
  }

  :root[data-theme='dark'] {
    color-scheme: dark;
    ${darkThemeCssVariables}
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
    font-family: 'Pretendard', 'sans-serif';
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-size: 1.6rem;
    line-height: 1.5;
    background-color: ${({ theme }) => theme.colors.bgPage};
  }

  ol,
  ul,
  li {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  a:focus,
  button:focus {
    outline: none;
    -webkit-tap-highlight-color: transparent;
  }

  button {
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
  }
`;

let browserQueryClient: QueryClient | undefined = undefined;

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
    <ThemeProvider theme={theme[themeType]}>
      <GlobalStyles />
      <ConfirmProvider>
        <AppShell>{children}</AppShell>
      </ConfirmProvider>
    </ThemeProvider>
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
            <StyleRegistry>
              <ThemedApp>{children}</ThemedApp>
            </StyleRegistry>
          </ThemeHydration>
        </JotaiProvider>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
