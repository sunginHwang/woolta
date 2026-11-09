'use client';

// 스켈레톤 조각이 wds(클라이언트 컴포넌트) 배럴을 거쳐 훅을 끌어오므로 라우트 로딩도 클라이언트로 둔다
import { AccountBookHomeSkeleton } from '../domains/account-books/main/AccountBookHomeSkeleton';

/** 홈(/) 라우트 로딩 — 실제 홈 레이아웃(상단바·요약·주간 예산·주 달력·일별 리스트)과 같은 뼈대 */
export default function Loading() {
  return <AccountBookHomeSkeleton />;
}
