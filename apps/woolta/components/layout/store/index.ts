'use client';

import { ThemeType } from '@wds';
import { atom, useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { saveThemeTypeCookie } from './themeCookie';

/**
 * 테마 상태.
 * 서버가 쿠키로 읽은 값으로 초기 hydrate 되므로 atomWithStorage(localStorage) 를 쓰지 않는다.
 * (localStorage 는 클라이언트에서만 읽히기 때문에 첫 페인트에 테마가 바뀌는 깜빡임이 생긴다)
 */
export const themeTypeAtom = atom<ThemeType>('light');

export const railExpandedAtom = atomWithStorage<boolean>('woolta:rail-expanded', false);

/** 테마 상태와, 쿠키까지 함께 저장하는 setter 를 반환한다. */
export const useThemeType = () => {
  const [themeType, setThemeType] = useAtom(themeTypeAtom);

  const changeThemeType = (nextThemeType: ThemeType) => {
    setThemeType(nextThemeType);
    saveThemeTypeCookie(nextThemeType);
  };

  return [themeType, changeThemeType] as const;
};
