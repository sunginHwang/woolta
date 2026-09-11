'use client';

import {
  useCreateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useUpdateCalendarEventMutation,
} from '../api/gql.generated';
import { useCalendarStore } from '../stores/useCalendarStore';
import { useCalendarEventsCache } from './useCalendarEvents';

interface CreateEventInput {
  title: string;
  description?: string | null;
  /** ISO */
  startAt: string;
  /** ISO, exclusive */
  endAt: string;
  isAllDay?: boolean;
  color?: string | null;
}

interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

/** 일정을 만든다. 성공하면 편집창을 닫는다. */
export const useCreateCalendarEvent = () => {
  const { invalidateCalendarEvents } = useCalendarEventsCache();
  const closeEvent = useCalendarStore((state) => state.closeEvent);

  const { mutateAsync, isPending } = useCreateCalendarEventMutation({
    onSuccess: () => {
      invalidateCalendarEvents();
      closeEvent();
    },
  });

  return {
    createEvent: (input: CreateEventInput) => mutateAsync({ input }),
    isCreating: isPending,
  };
};

/**
 * 일정을 수정한다.
 * 드래그로 옮기거나 리사이즈할 때도 이 훅을 쓴다 — 그 경우 편집창이 없으니 닫지 않는다.
 */
export const useUpdateCalendarEvent = () => {
  const { invalidateCalendarEvents } = useCalendarEventsCache();

  const { mutateAsync, isPending } = useUpdateCalendarEventMutation({
    onSuccess: () => invalidateCalendarEvents(),
  });

  return {
    updateEvent: (input: UpdateEventInput) => mutateAsync({ input }),
    isUpdating: isPending,
  };
};

/** 일정을 삭제한다. 성공하면 편집창을 닫는다. */
export const useDeleteCalendarEvent = () => {
  const { invalidateCalendarEvents } = useCalendarEventsCache();
  const closeEvent = useCalendarStore((state) => state.closeEvent);

  const { mutateAsync, isPending } = useDeleteCalendarEventMutation({
    onSuccess: () => {
      invalidateCalendarEvents();
      closeEvent();
    },
  });

  return {
    deleteEvent: (id: string) => mutateAsync({ input: { id } }),
    isDeleting: isPending,
  };
};
