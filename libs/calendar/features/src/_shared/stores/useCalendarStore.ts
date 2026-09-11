import { create } from 'zustand';
import { combine, persist } from 'zustand/middleware';
import type { CalendarViewMode } from '../types';

interface EventDraft {
  /** 수정 대상 일정 id. null 이면 새 일정 */
  eventId: string | null;
  /** 새 일정의 초기 시작 (드래그로 만든 구간의 시작, ISO) */
  startAt: string;
  /** 새 일정의 초기 끝 (exclusive, ISO) */
  endAt: string;
  /** 종일 칸에서 만들었는지 */
  isAllDay: boolean;
}

/**
 * 캘린더 UI 상태 전용 store. 일정·공유 데이터는 GraphQL(react-query) 캐시가 소유한다.
 *
 * 뷰 모드는 사용자 취향이라 영속화하고, 기준 날짜와 편집 중인 draft 는 하지 않는다
 * (새로고침 때 과거 날짜로 떨어지거나 편집창이 되살아나면 어색하다).
 */
export const useCalendarStore = create(
  persist(
    combine(
      {
        viewMode: 'month' as CalendarViewMode,
        /** 조회 범위의 기준 날짜 (ISO). 서버 렌더와 값이 갈리지 않도록 초기값은 빈 문자열로 두고 마운트 후 채운다 */
        baseDateIso: '',
        eventDraft: null as EventDraft | null,
      },
      (set) => ({
        setViewMode: (viewMode: CalendarViewMode) => {
          set({ viewMode });
        },
        setBaseDate: (baseDateIso: string) => {
          set({ baseDateIso });
        },
        /** 빈 칸을 드래그/클릭해 새 일정을 만들기 시작한다 */
        openNewEvent: (draft: Omit<EventDraft, 'eventId'>) => {
          set({ eventDraft: { ...draft, eventId: null } });
        },
        /** 기존 일정을 클릭해 편집을 시작한다 */
        openEvent: (eventId: string) => {
          set({ eventDraft: { eventId, startAt: '', endAt: '', isAllDay: false } });
        },
        closeEvent: () => {
          set({ eventDraft: null });
        },
      }),
    ),
    {
      name: 'woolta:calendar',
      partialize: ({ viewMode }) => ({ viewMode }),
    },
  ),
);
