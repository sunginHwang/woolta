'use client';

import { useMount } from '@common';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { getBlogConfig } from '../../_shared/config';
import { toastMessageAtom } from '../../_shared/toast/store';
import { postAtom, setPostAtom, type WritePost } from '../../_shared/write-store';

export const FIVE_MIN: number = 1_000 * 60 * 5;

export const useTempSavePost = () => {
  const { content, title, category, postNo } = useAtomValue(postAtom);
  const setPost = useSetAtom(setPostAtom);
  const setToastMessage = useSetAtom(toastMessageAtom);

  useMount(() => {
    loadTempPost();
  });

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== '') {
        const { tempPostAutoSaveKey } = getBlogConfig();
        const tempPost = { postNo, category, title, content };
        localStorage.setItem(tempPostAutoSaveKey, JSON.stringify(tempPost));
        setToastMessage('임시저장 되었습니다.');
      }
    }, FIVE_MIN);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [title, content, postNo, category]);

  const loadTempPost = () => {
    try {
      const { tempPostAutoSaveKey } = getBlogConfig();
      const tempPost: WritePost | null = JSON.parse(localStorage.getItem(tempPostAutoSaveKey) ?? '');

      if (!tempPost) {
        return;
      }

      if (confirm('임시저장된 정보를 불러오시겠습니까?')) {
        setPost(tempPost);
        localStorage.removeItem(tempPostAutoSaveKey);
      } else {
        localStorage.removeItem(tempPostAutoSaveKey);
      }
    } catch {
      return;
    }
  };
};
