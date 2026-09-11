export const dynamic = 'force-dynamic';

import { CalendarBoardScreen, prefetchCalendarScreens } from '@calendar/screens';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { cookies } from 'next/headers';

export default async function CalendarPage() {
  const queryClient = new QueryClient();

  // 캘린더는 사용자별 데이터라 RSC fetch 에 인증 쿠키를 직접 실어줘야 한다.
  await prefetchCalendarScreens(queryClient, new Date().toISOString(), { cookie: (await cookies()).toString() });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarBoardScreen />
    </HydrationBoundary>
  );
}
