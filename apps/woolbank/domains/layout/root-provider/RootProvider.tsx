'use client';
import { AppHostProvider, useSessionExpiredRedirect } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { Provider as JotaiProvider } from 'jotai';
import { ConfirmProvider } from '../../../components/Confirm/ConfirmContext';
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

export const RootProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <AppHostProvider appHost='woolbank'>
      <QueryClientProvider client={queryClient}>
        <SessionGuard>
          <ReactQueryStreamedHydration>
            {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
            <JotaiProvider>
              <ConfirmProvider>
                <Layout>{children}</Layout>
              </ConfirmProvider>
            </JotaiProvider>
          </ReactQueryStreamedHydration>
        </SessionGuard>
      </QueryClientProvider>
    </AppHostProvider>
  );
};
