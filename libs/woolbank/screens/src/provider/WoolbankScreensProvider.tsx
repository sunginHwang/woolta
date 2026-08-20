'use client';

import { ConfirmProvider } from '@woolta/woolbank-features';
import { Toast } from '@woolta/woolbank-features';
import { WoolbankRoutesProvider, WoolbankRoutes } from '@woolta/woolbank-features';
import { ReactNode } from 'react';

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
