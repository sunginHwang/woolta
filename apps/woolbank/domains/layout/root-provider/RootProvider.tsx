'use client';
import { AppHostProvider } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { theme } from '@wds/colors';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from 'styled-components';
import { ConfirmProvider } from '../../../components/Confirm/ConfirmContext';
import { setConfig } from '../../../utils/config';
import { Layout } from '../Layout';
import { GlobalStyle } from './GlobalStyle';
import { StyledComponentsRegistry } from './StyleRegistry';

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

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <AppHostProvider appHost='woolbank'>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
          <JotaiProvider>
            <StyledComponentsRegistry>
              <ThemeProvider theme={theme.light}>
                <GlobalStyle />
                <ConfirmProvider>
                  <Layout>{children}</Layout>
                </ConfirmProvider>
              </ThemeProvider>
            </StyledComponentsRegistry>
          </JotaiProvider>
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
