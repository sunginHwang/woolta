export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { prefetchTodoScreens } from '@todo/screens';
import { cookies } from 'next/headers';
import type { ReactNode } from 'react';
import { TodoAppShell } from '../../components/todo/TodoAppShell';

/**
 * 사이드바·상세 패널이 이 레이아웃에 있어서 프리페치도 여기서 한다.
 * 페이지에서만 채우면 사이드바(뱃지)와 상세는 하이드레이션 대상에서 빠져 클라이언트가 다시 조회한다.
 *
 * 할 일은 사용자별 데이터라 RSC fetch 에 인증 쿠키를 직접 실어줘야 한다.
 */
export default async function TodoLayout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  await prefetchTodoScreens(queryClient, { cookie: (await cookies()).toString() });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoAppShell>{children}</TodoAppShell>
    </HydrationBoundary>
  );
}
