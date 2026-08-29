import { getCategoryIdFromListKey } from '../routes';
import type { TodoListKey } from '../types';
import { getTomorrowKey } from './todoDate';

interface TodoDraftDefaults {
  /** 기본 마감일 (YYYY-MM-DD, 미정이면 null) */
  dueDate: string | null;
  /** 기본 카테고리 id (기본함이면 null) */
  categoryId: string | null;
}

/**
 * 리스트 키에 맞는 새 할 일의 기본 마감일/카테고리를 반환한다.
 * 오늘 리스트는 오늘, 미래 리스트는 내일을 기본 마감일로 둔다.
 * @param listKey 현재 보고 있는 리스트 키
 * @param todayKey 오늘 날짜 (YYYY-MM-DD)
 */
export const getDefaultTodoDraft = (listKey: TodoListKey, todayKey: string): TodoDraftDefaults => {
  const categoryId = getCategoryIdFromListKey(listKey);

  if (categoryId !== null) {
    return { dueDate: null, categoryId };
  }
  if (listKey === 'today') {
    return { dueDate: todayKey, categoryId: null };
  }
  if (listKey === 'upcoming') {
    return { dueDate: getTomorrowKey(todayKey), categoryId: null };
  }
  return { dueDate: null, categoryId: null };
};
