'use client';

import type { ThemeType } from '@wds';
import { atom, useAtom } from 'jotai';

/**
 * 테마를 저장하는 쿠키 이름.
 * localStorage 가 아닌 쿠키를 쓰는 이유는 서버 첫 렌더에서도 테마를 알아야
 * 라이트 → 다크로 바뀌는 깜빡임(FOUC)이 생기지 않기 때문이다.
 */
export const THEME_COOKIE_NAME = 'woolbank_theme';

const THEME_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** 브라우저 테마 컬러(주소창·상태바). 다크 토큰 bgPage / 라이트 bgSurface 와 같은 값 */
export const THEME_COLOR: Record<ThemeType, string> = {
  light: '#ffffff',
  dark: '#121212',
};

/** 쿠키 값이 유효한 테마인지 검사해 반환한다. (아니면 기본값 light) */
export const parseThemeType = (value: string | undefined): ThemeType =>
  value === 'dark' || value === 'light' ? value : 'light';

/** 브라우저 쿠키에 테마를 저장한다. 다음 요청의 서버 렌더에서 이 값을 읽는다. */
export const saveThemeTypeCookie = (themeType: ThemeType) => {
  document.cookie = `${THEME_COOKIE_NAME}=${themeType}; path=/; max-age=${THEME_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
};

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
