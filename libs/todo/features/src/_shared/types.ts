/** 할 일 우선순위 */
export type TodoPriority = 'none' | 'low' | 'medium' | 'high';

/** 사이드바 스마트 리스트 키 */
export type SmartListKey = 'today' | 'upcoming' | 'inbox' | 'completed' | 'trash';

/** 사이드바에서 선택 가능한 리스트 키 (스마트 리스트 또는 카테고리) */
export type TodoListKey = SmartListKey | `category:${string}`;

/** 리스트 영역 표시 방식 */
export type TodoViewMode = 'list' | 'kanban';

export interface Todo {
  /** 할 일 고유 id */
  id: string;
  /** 제목 */
  title: string;
  /** 설명 메모 */
  memo: string;
  /** 마감일 (YYYY-MM-DD, 없으면 null) */
  dueDate: string | null;
  /** 소속 카테고리 id (null = 기본함) */
  categoryId: string | null;
  /** 우선순위 */
  priority: TodoPriority;
  /** 완료 여부 */
  isCompleted: boolean;
  /** 완료 시각 (ISO 문자열, 미완료면 null) */
  completedAt: string | null;
  /** 휴지통 이동 시각 (ISO 문자열, null = 정상) */
  deletedAt: string | null;
  /** 수동 정렬 순서 */
  order: number;
  /** 생성일 (ISO 문자열) */
  createdAt: string;
  /** 수정일 (ISO 문자열) */
  updatedAt: string;
}

export interface TodoCategory {
  /** 카테고리 고유 id */
  id: string;
  /** 카테고리 이름 (이모지 포함 가능) */
  name: string;
  /** 정렬 순서 */
  order: number;
  /** 생성일 (ISO 문자열) */
  createdAt: string;
}
