import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import type { TodoViewMode } from '../types';

/**
 * 할 일 UI 상태 전용 store. 할 일/카테고리 데이터는 GraphQL(react-query) 캐시가 소유한다.
 *
 * 뷰 모드와 상세 패널 표시는 사용자 취향이라 영속화하고,
 * 선택 id 는 서버에서 삭제된 할 일을 가리킬 수 있어 영속화하지 않는다.
 */
export const useTodoStore = create(
  persist(
    combine(
      {
        selectedTodoId: null as string | null,
        viewMode: 'list' as TodoViewMode,
        isDetailVisible: false,
      },
      (set) => ({
        selectTodo: (id: string | null) => {
          // 할 일을 고르면 상세 패널이 닫혀 있어도 다시 열어준다.
          set({ selectedTodoId: id, isDetailVisible: true });
        },
        setViewMode: (viewMode: TodoViewMode) => {
          set({ viewMode });
        },
        setDetailVisible: (isDetailVisible: boolean) => {
          set({ isDetailVisible });
        },
        clearDetail: () => {
          // 진입/리스트 전환 시 호출된다. 고른 할 일이 없으면 빈 패널을 띄우지 않고 닫아 둔다.
          set({ selectedTodoId: null, isDetailVisible: false });
        },
        toggleDetailVisible: () => {
          set((state) => ({ isDetailVisible: !state.isDetailVisible }));
        },
      }),
    ),
    {
      name: 'woolta:todos',
      partialize: ({ viewMode, isDetailVisible }) => ({ viewMode, isDetailVisible }),
    },
  ),
);
