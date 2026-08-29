'use client';

import { ConfirmProvider, Toast, type WoolbankRoutes, WoolbankRoutesProvider } from '@woolta/woolbank-features';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  routes?: Partial<WoolbankRoutes>;
}

export const WoolbankScreensProvider = ({ children, routes }: Props) => {
  return (
    <WoolbankRoutesProvider routes={routes}>
      <ConfirmProvider>
        {children}
        <Toast />
      </ConfirmProvider>
    </WoolbankRoutesProvider>
  );
};
