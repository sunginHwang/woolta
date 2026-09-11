'use client';

import { useLogout, useMeOptional } from '@woolta/user-features';

/**
 * blog 화면의 '현재 사용자' = woolta 공용 세션(`me`).
 *
 * 레거시는 blog DB 유저를 `/user/check/jwt` 로 조회하고 authToken 을 Authorization 헤더에 실었다.
 * 지금은 소셜 로그인으로 통합돼 세션이 `.woolta.com` 쿠키로만 오간다 — 응답에 토큰이 없다.
 *
 * 쓰기 권한은 서버가 판단한다(`requireBlogAdmin` — BLOG_ADMIN_USER_IDS 허용목록).
 * isLogin 은 '로그인 여부'일 뿐 '글을 쓸 수 있는지'가 아니다.
 */
export const useUserInfo = () => {
  const { user, isLoading } = useMeOptional();
  const { logout } = useLogout();

  return {
    user,
    isLogin: user !== undefined,
    isLoading,
    logout,
  };
};
