'use client';

import { AppHostProvider } from '@common';
import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { settingAccessHeaderToken } from '../../../utils/api';
import config, { setConfig } from '../../../utils/config';
import { getCookie } from '../../../utils/cookie';
import Layout from '../Layout';

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

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  const accessToken = getCookie(config.accessToken);
  if (accessToken) {
    settingAccessHeaderToken(accessToken);
  }

  return (
    <>
      <AppHostProvider appHost='blog'>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <Layout>{children}</Layout>
          </JotaiProvider>
        </QueryClientProvider>
      </AppHostProvider>
    </>
  );
};
