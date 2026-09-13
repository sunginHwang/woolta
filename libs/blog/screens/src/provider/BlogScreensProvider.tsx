'use client';

import { BlogRoutesContext, NotificationBar } from '@blog/features';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  basePath: string;
}

/**
 * 인증 토큰을 헤더에 심는 과정이 없다 — woolta-api 는 `.woolta.com` 쿠키 세션만 본다.
 * 요청은 fetch 의 credentials 로 쿠키를 싣는다.
 */
export function BlogScreensProvider({ basePath, children }: Props) {
  return (
    <BlogRoutesContext.Provider value={{ basePath }}>
      {children}
      <NotificationBar />
    </BlogRoutesContext.Provider>
  );
}
