import { create } from 'zustand';
import { combine } from 'zustand/middleware';

/**
 * 메모 UI 상태 전용 store. 메모 데이터 자체는 GraphQL(react-query) 캐시가 소유한다.
 * 선택 id 는 서버에서 삭제된 메모를 가리킬 수 있어 영속화하지 않는다.
 */
export const useMemoStore = create(
  combine(
    {
      selectedMemoId: null as string | null,
    },
    (set) => ({
      selectMemo: (id: string | null) => {
        set({ selectedMemoId: id });
      },
    }),
  ),
);
