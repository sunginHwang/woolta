'use client';
import { ThemeProvider } from 'styled-components';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { theme } from 'libs/wds/src/lib/style/colors';
import { Layout } from '../Layout';
import { StyledComponentsRegistry } from './StyleRegistry';
import { ConfirmProvider } from '../../../components/confirm/ConfirmContext';
import { setConfig } from '../../../utils/config';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { GlobalStyle } from './GlobalStyle';

setConfig();

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
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
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
  );
};
