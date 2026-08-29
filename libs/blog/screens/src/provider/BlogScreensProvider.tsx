'use client';

import { BlogRoutesContext, getBlogConfig, getCookie, NotificationBar, settingAccessHeaderToken } from '@blog/features';
import { type PropsWithChildren, useEffect } from 'react';

interface Props extends PropsWithChildren {
  basePath: string;
}

export function BlogScreensProvider({ basePath, children }: Props) {
  useEffect(() => {
    const { accessTokenCookie } = getBlogConfig();
    const token = getCookie(accessTokenCookie);
    if (token) {
      settingAccessHeaderToken(token);
    }
  }, []);

  return (
    <BlogRoutesContext.Provider value={{ basePath }}>
      {children}
      <NotificationBar />
    </BlogRoutesContext.Provider>
  );
}
