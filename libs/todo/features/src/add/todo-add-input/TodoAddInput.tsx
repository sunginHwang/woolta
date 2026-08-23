'use client';

import { TodoAddInputOverlay } from './components/TodoAddInputOverlay';
import { TodoAddInputRoot } from './components/TodoAddInputRoot';

/**
 * 할 일 추가 입력창 (compound 컴포넌트).
 *
 * "내일", "8월 25일" 같은 날짜 표현과 기존 카테고리 이름("업무", "#업무")을 감지해
 * 인라인 하이라이트하고 하단에 칩으로 노출한다.
 * 제출 시 감지된 토큰은 제목에서 제거되고 각각 마감일/카테고리로 설정된다.
 *
 * - `TodoAddInput` — 리스트 상단에 상시 노출되는 인라인 입력창
 * - `TodoAddInput.Overlay` — Q 단축키로 떠오르는 오버레이 입력창
 *
 * @example
 * ```tsx
 * <TodoAddInput listKey={listKey} />
 * <TodoAddInput.Overlay listKey={listKey} />
 * ```
 */
export const TodoAddInput = Object.assign(TodoAddInputRoot, {
  Overlay: TodoAddInputOverlay,
});
