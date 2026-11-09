import { DailyListSkeleton } from './daily-list/DailyListSkeleton';
import { HomeTopbarSkeleton } from './home-topbar/HomeTopbarSkeleton';
import { MonthSummarySkeleton } from './month-summary/MonthSummarySkeleton';

/**
 * 가계부 홈 전체 스켈레톤 — app/loading.tsx(라우트 로딩)가 쓴다.
 * 섹션별 Suspense 폴백과 같은 조각을 조립해 로딩 중과 로딩 후 레이아웃이 어긋나지 않게 한다.
 * @component
 */
export const AccountBookHomeSkeleton = () => (
  <>
    <HomeTopbarSkeleton />
    <MonthSummarySkeleton />
    <DailyListSkeleton />
  </>
);
