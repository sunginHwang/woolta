'use client';

import { createContext, type ReactNode, useContext } from 'react';

export interface WoolbankRoutes {
  main: string;
  save: string;
}

const DEFAULT_ROUTES: WoolbankRoutes = {
  main: '/bank',
  save: '/bank/save',
};

export const WoolbankRoutesContext = createContext<WoolbankRoutes>(DEFAULT_ROUTES);

export const useWoolbankRoutes = () => useContext(WoolbankRoutesContext);

export const WoolbankRoutesProvider = ({
  routes,
  children,
}: {
  routes?: Partial<WoolbankRoutes>;
  children: ReactNode;
}) => {
  const value: WoolbankRoutes = { ...DEFAULT_ROUTES, ...routes };
  return <WoolbankRoutesContext.Provider value={value}>{children}</WoolbankRoutesContext.Provider>;
};
