'use client';

import { getCategoryIdFromListKey } from '../routes';
import { useTodoStore } from '../stores/useTodoStore';
import { TodoListKey } from '../types';

const SMART_LIST_TITLES: Record<string, string> = {
  today: '오늘',
  upcoming: '미래',
  inbox: '기본함',
  completed: '완료',
  trash: '휴지통',
};

/**
 * 리스트 패널(보드) 구성에 필요한 상태를 반환한다.
 * screens 레이어에서 헤더/뷰 전환을 조합할 때 사용한다.
 * @param listKey 현재 라우트가 지정한 리스트 키
 */
export const useTodoBoardView = (listKey: TodoListKey) => {
  const viewMode = useTodoStore((state) => state.viewMode);
  const setViewMode = useTodoStore((state) => state.setViewMode);
  const categories = useTodoStore((state) => state.categories);

  const categoryId = getCategoryIdFromListKey(listKey);
  const category = categoryId === null ? null : categories.find((item) => item.id === categoryId) ?? null;

  /** 존재하지 않는 카테고리 경로로 진입했는지 여부 */
  const isMissingCategory = categoryId !== null && category === null;
  const isUpcoming = listKey === 'upcoming';
  const isArchiveList = listKey === 'completed' || listKey === 'trash';
  const isViewToggleVisible = !isArchiveList && !isMissingCategory && !isUpcoming;

  return {
    listKey,
    listTitle: categoryId === null ? SMART_LIST_TITLES[listKey] ?? '오늘' : category?.name ?? '리스트',
    isMissingCategory,
    isUpcoming,
    viewMode,
    setViewMode,
    /** 할 일 추가 입력창 노출 여부 (완료/휴지통, 없는 카테고리에서는 숨김) */
    isTodoAddVisible: !isArchiveList && !isMissingCategory,
    /** 리스트/칸반 전환 노출 여부 (미래는 날짜 축이라 칸반 미지원) */
    isViewToggleVisible,
  };
};
