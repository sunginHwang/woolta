'use client';

import { createContext, type ReactNode, useContext } from 'react';

export interface WoolbankRoutes {
  main: string;
  save: string;
  /**
   * 벌크 업로드 화면. 이 화면이 없는 호스트(모바일 woolbank)는 빈 문자열을 넘겨 진입점을 숨긴다.
   */
  bulkUpload: string;
}

const DEFAULT_ROUTES: WoolbankRoutes = {
  main: '/bank',
  save: '/bank/save',
  bulkUpload: '/bank/bulk-upload',
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
