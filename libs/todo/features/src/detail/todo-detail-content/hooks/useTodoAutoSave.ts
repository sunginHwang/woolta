'use client';

import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo } from 'react';
import { useTodoStore } from '../../../_shared/stores/useTodoStore';

const AUTO_SAVE_DELAY_MS = 500;

/**
 * 할 일 제목/메모 입력을 디바운스해 저장한다.
 * 언마운트 시, 그리고 flush 호출 시 대기 중인 변경을 즉시 저장한다.
 */
export const useTodoAutoSave = (todoId: string) => {
  const updateTodo = useTodoStore((state) => state.updateTodo);

  const saveTitle = useMemo(
    () => debounce((title: string) => updateTodo(todoId, { title }), AUTO_SAVE_DELAY_MS),
    [todoId, updateTodo],
  );

  const saveMemo = useMemo(
    () => debounce((memo: string) => updateTodo(todoId, { memo }), AUTO_SAVE_DELAY_MS),
    [todoId, updateTodo],
  );

  const flush = useCallback(() => {
    saveTitle.flush();
    saveMemo.flush();
  }, [saveTitle, saveMemo]);

  useEffect(() => () => flush(), [flush]);

  return { saveTitle, saveMemo, flush };
};
