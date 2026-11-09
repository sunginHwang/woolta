import { AccountBookHomeSkeleton } from '../domains/account-books/main/AccountBookHomeSkeleton';

/** 홈(/) 라우트 로딩 — 실제 홈 레이아웃(상단바·요약·주간 예산·주 달력·일별 리스트)과 같은 뼈대 */
export default function Loading() {
  return <AccountBookHomeSkeleton />;
}
