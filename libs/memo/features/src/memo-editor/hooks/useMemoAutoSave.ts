'use client';

import type { JSONContent } from '@tiptap/core';
import { debounce } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useUpdateMemoMutation } from '../../_shared/api/gql.generated';
import { useMemoDetailCache } from '../../_shared/hooks/useMemoDetail';
import { useMemoListCache } from '../../_shared/hooks/useMemoList';

const AUTO_SAVE_DELAY_MS = 500;

interface PendingPatch {
  title?: string;
  content?: JSONContent;
}

/**
 * 제목/본문 변경을 debounce로 서버에 자동 저장한다. 언마운트 시 대기 중인 저장을 flush한다.
 *
 * 제목과 본문은 하나의 대기 패치로 합쳐 updateMemo 를 한 번만 호출한다.
 * 따로 보내면 두 뮤테이션이 경합해 나중에 도착한 응답이 상대 변경을 덮어쓸 수 있다.
 */
export const useMemoAutoSave = (memoId: string) => {
  const pendingPatchRef = useRef<PendingPatch>({});
  const { setMemoDetail } = useMemoDetailCache();
  const { invalidateMemoList } = useMemoListCache();

  const { mutate, isPending } = useUpdateMemoMutation({
    onSuccess: ({ updateMemo }) => {
      setMemoDetail(updateMemo);
      // 목록은 제목·수정일을 보여주므로 갱신된 값을 받도록 무효화한다.
      invalidateMemoList();
    },
  });

  const save = useMemo(
    () =>
      debounce(() => {
        const patch = pendingPatchRef.current;
        pendingPatchRef.current = {};

        if (patch.title === undefined && patch.content === undefined) {
          return;
        }
        mutate({ input: { id: memoId, ...patch } });
      }, AUTO_SAVE_DELAY_MS),
    [memoId, mutate],
  );

  const saveTitle = useCallback(
    (title: string) => {
      pendingPatchRef.current.title = title;
      save();
    },
    [save],
  );

  const saveContent = useCallback(
    (content: JSONContent) => {
      pendingPatchRef.current.content = content;
      save();
    },
    [save],
  );

  useEffect(() => {
    return () => {
      save.flush();
    };
  }, [save]);

  return { saveTitle, saveContent, isSaving: isPending };
};
