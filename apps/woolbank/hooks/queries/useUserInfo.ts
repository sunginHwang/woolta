'use client';

import { useMeOptional } from '@woolta/user-features';

/**
 * 화면이 쓰는 사용자 정보 형태.
 * 서버(GraphQL)는 `profileImg` / `id: Int` 로 주므로 여기서 기존 형태로 맞춘다.
 */
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
  loginType: string;
  authType: string;
}

export const useUserInfo = () => {
  const { user, isLoading } = useMeOptional();

  const userInfo: UserInfo | null = user
    ? {
        id: String(user.id),
        name: user.name,
        email: user.email,
        imageUrl: user.profileImg,
        loginType: user.loginType,
        authType: user.authType ?? '',
      }
    : null;

  return {
    userInfo,
    /** 공유코드로 접속한 읽기 전용 세션 — 쓰기 UI를 감춘다. */
    isShareUser: user?.authType === 'share',
    isLoading,
  };
};
