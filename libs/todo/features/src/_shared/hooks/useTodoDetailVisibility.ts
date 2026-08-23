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

  return {
    isDetailVisible,
    showDetail: () => setDetailVisible(true),
    hideDetail: () => setDetailVisible(false),
    toggleDetail: toggleDetailVisible,
  };
};
