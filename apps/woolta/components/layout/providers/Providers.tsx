'use client';

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from '@wds';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import AppShell from '../app-shell/AppShell';
import { themeTypeAtom } from '../store';
import StyleRegistry from './StyledComponentsRegistry';

const GlobalStyles = createGlobalStyle`
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

const ThemedApp = ({ children }: { children: React.ReactNode }) => {
  const themeType = useAtomValue(themeTypeAtom);

  return (
    <ThemeProvider theme={theme[themeType]}>
      <GlobalStyles />
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <JotaiProvider>
        <StyleRegistry>
          <ThemedApp>{children}</ThemedApp>
        </StyleRegistry>
      </JotaiProvider>
    </QueryClientProvider>
  );
};
