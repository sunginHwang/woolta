'use client';

import { useTodoStore } from '../stores/useTodoStore';

/**
 * 우측 상세 패널의 표시 여부와 제어 함수를 반환한다.
 * 레이아웃(호스트 앱)과 닫기 버튼(패널)이 같은 상태를 공유하기 위한 훅이다.
 */
export const useTodoDetailVisibility = () => {
  const isDetailVisible = useTodoStore((state) => state.isDetailVisible);
  const setDetailVisible = useTodoStore((state) => state.setDetailVisible);
  const toggleDetailVisible = useTodoStore((state) => state.toggleDetailVisible);
  const clearDetail = useTodoStore((state) => state.clearDetail);

  return {
    isDetailVisible,
    showDetail: () => setDetailVisible(true),
    hideDetail: () => setDetailVisible(false),
    toggleDetail: toggleDetailVisible,
    /** 선택 해제 + 패널 닫기 (앱 진입/리스트 전환 시 초기화용) */
    clearDetail,
  };
};
