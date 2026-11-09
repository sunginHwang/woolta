'use client';

import type { ThemeType } from '@wds';
import { atom, useAtom } from 'jotai';
import { saveThemeTypeCookie } from './themeCookie';

export { parseThemeType, saveThemeTypeCookie, THEME_COLOR, THEME_COOKIE_NAME } from './themeCookie';

/** 현재 테마. 서버가 쿠키에서 읽은 값으로 RootProvider 가 하이드레이션한다. */
export const themeTypeAtom = atom<ThemeType>('light');

/** 테마 읽기·변경. 변경 시 쿠키에도 저장해 새로고침 후에도 유지된다. */
export const useThemeType = () => {
  const [themeType, setThemeTypeAtom] = useAtom(themeTypeAtom);

  const setThemeType = (next: ThemeType) => {
    setThemeTypeAtom(next);
    saveThemeTypeCookie(next);
  };

  return { themeType, setThemeType };
};
