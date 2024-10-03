import { useMount } from '@common';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { WritePost, postAtom, setPostAtom } from '../store';

const TEMP_POST_AUTO_SAVE = 'TEMP_POST_AUTO_SAVE';
export const FIVE_MIN: number = 1000 * 60 * 5;

export const useTempSavePost = () => {
  const { content, title, category, postNo } = useAtomValue(postAtom);
  const setPost = useSetAtom(setPostAtom);

  useMount(() => {
    loadTempPost();
  });

  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content !== '') {
        const tempPost = { postNo, category, title, content };
        localStorage.setItem(TEMP_POST_AUTO_SAVE, JSON.stringify(tempPost));
        alert('임시저장 되었습니다.');
      }
    }, FIVE_MIN);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [title, content, postNo, category]);

  const loadTempPost = () => {
    try {
      const tempPost: WritePost | null = JSON.parse(localStorage.getItem(TEMP_POST_AUTO_SAVE) ?? '');

      if (!tempPost) {
        return;
      }

      if (confirm('임시저장된 정보를 불러오시겠습니까?')) {
        setPost(tempPost);
        localStorage.removeItem(TEMP_POST_AUTO_SAVE);
      } else {
        localStorage.removeItem(TEMP_POST_AUTO_SAVE);
      }
    } catch {
      return;
    }
  };
};
