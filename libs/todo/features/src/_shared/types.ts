import type { TodoCategoryPartsFragment, TodoPartsFragment } from './api/gql.generated';

/** 할 일 우선순위 — 서버 enum 을 그대로 쓴다 (HIGH / MEDIUM / LOW / NONE) */
export type { TodoPriority } from './api/gql.generated';

/** 사이드바 스마트 리스트 키 */
export type SmartListKey = 'today' | 'upcoming' | 'inbox' | 'completed' | 'trash';

/** 사이드바에서 선택 가능한 리스트 키 (스마트 리스트 또는 카테고리) */
export type TodoListKey = SmartListKey | `category:${string}`;

/** 리스트 영역 표시 방식 (클라이언트 전용 UI 상태) */
export type TodoViewMode = 'list' | 'kanban';

export type Todo = TodoPartsFragment;

export type TodoCategory = TodoCategoryPartsFragment;
