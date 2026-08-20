'use client';

import type { JSONContent } from '@tiptap/core';
import { debounce } from 'lodash-es';
import { useEffect, useMemo } from 'react';
import { useMemoStore } from '../../_shared/stores/useMemoStore';

const AUTO_SAVE_DELAY_MS = 500;

/**
 * 제목/본문 변경을 debounce로 자동 저장한다. 언마운트 시 대기 중인 저장을 flush한다.
 */
export const useMemoAutoSave = (memoId: string) => {
  const updateMemo = useMemoStore((state) => state.updateMemo);

  const saveTitle = useMemo(
    () => debounce((title: string) => updateMemo(memoId, { title }), AUTO_SAVE_DELAY_MS),
    [memoId, updateMemo],
  );

  const saveContent = useMemo(
    () => debounce((content: JSONContent) => updateMemo(memoId, { content }), AUTO_SAVE_DELAY_MS),
    [memoId, updateMemo],
  );

  useEffect(() => {
    return () => {
      saveTitle.flush();
      saveContent.flush();
    };
  }, [saveTitle, saveContent]);

  return { saveTitle, saveContent };
};
