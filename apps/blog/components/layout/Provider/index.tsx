'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import Layout from '../';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <Layout>{children}</Layout>
        </JotaiProvider>
      </QueryClientProvider>
    </>
  );
};

export function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  // Only create stylesheet once with lazy initial state
  // x-ref: https://reactjs.org/docs/hooks-reference.html#lazy-initial-state
  const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet());

  useServerInsertedHTML(() => {
    const styles = styledComponentsStyleSheet.getStyleElement();
    styledComponentsStyleSheet.instance.clearTag();
    return <>{styles}</>;
  });

  if (typeof window !== 'undefined') return <>{children}</>;

  return <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>{children}</StyleSheetManager>;
}
