'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { isUnauthenticatedError } from '../utils/graphqlFetch';

/**
 * 세션이 끊기면 로그인 화면으로 보낸다.
 *
 * 라우트 진입은 proxy(미들웨어)가 막지만, **머무는 동안 세션이 만료되는 경우**는 걸러지지 않는다.
 * 그때 조회가 UNAUTHENTICATED 로 실패하는데, 화면마다 처리하면 빠뜨리기 쉬워 캐시 이벤트를
 * 한곳에서 구독한다.
 *
 * 서버는 access 가 만료되면 refresh 쿠키로 자동 회전하므로, 여기까지 오는 건
 * **회전도 실패한 진짜 만료**다.
 */
export const useSessionExpiredRedirect = (loginUrl: string) => {
  const queryClient = useQueryClient();
  // 여러 쿼리가 동시에 실패해도 한 번만 보낸다
  const isRedirecting = useRef(false);

  useEffect(() => {
    const handle = (error: unknown) => {
      if (!isUnauthenticatedError(error) || isRedirecting.current) {
        return;
      }

      isRedirecting.current = true;
      // 만료된 세션으로 만든 캐시는 버린다 — 돌아왔을 때 이전 데이터가 스쳐 보이지 않도록
      queryClient.clear();
      window.location.replace(loginUrl);
    };

    // 조회와 변경은 캐시가 나뉘어 있다. 탭을 열어둔 채 저장하는 경우가 오히려 흔해 둘 다 본다.
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        handle(event.action.error);
      }
    });

    const unsubscribeMutation = queryClient.getMutationCache().subscribe((event) => {
      if (event.type === 'updated' && event.action.type === 'error') {
        handle(event.action.error);
      }
    });

    return () => {
      unsubscribeQuery();
      unsubscribeMutation();
    };
  }, [queryClient, loginUrl]);
};
