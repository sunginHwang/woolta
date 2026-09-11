'use client';

import {
  useLoginByShareCodeMutation,
  useLoginBySocialMutation,
  useLogoutMutation,
  useRefreshSessionMutation,
} from '../api/gql.generated';
import type { SocialLoginType, UserInfo } from '../types';
import { useMeCache } from './useMe';

interface LoginBySocialInput {
  /**
   * provider 가 발급한 토큰. GOOGLE = id_token, KAKAO_TALK / FACEBOOK = access token.
   *
   * 레거시 REST 는 클라이언트가 보낸 socialId 를 그대로 신뢰했지만, 서버는 이제 이 토큰을
   * provider 에 되물어 검증하고 거기서 확인된 식별자만 socialId 로 쓴다.
   * 따라서 socialId 는 보내지 않는다.
   */
  token: string;
  loginType: SocialLoginType;
  /** provider 프로필에서 채우는 보조 정보 — 서버 검증 대상이 아니다. */
  name?: string;
  email?: string;
  imageUrl?: string;
}

/**
 * 소셜 로그인. 세션은 쿠키로만 오간다 — 응답에 토큰이 담기지 않는다.
 *
 * 성공 시 캐시를 통째로 비우고 새 사용자로 다시 채운다. 로그인 전 화면에서 조회해 둔
 * 데이터가 남아 있으면 다른 사용자의 것이 섞이기 때문이다.
 */
export const useLoginBySocial = () => {
  const { clearSessionCache } = useMeCache();

  const { mutateAsync, isPending } = useLoginBySocialMutation({
    onSuccess: () => clearSessionCache(),
  });

  return {
    loginBySocial: ({ token, loginType, name, email, imageUrl }: LoginBySocialInput): Promise<UserInfo> =>
      mutateAsync({ input: { token, loginType, name, email, imageUrl } }).then((data) => data.loginBySocial),
    isLoggingIn: isPending,
  };
};

/** 공유코드 로그인 — 읽기 전용 세션(`authType: 'share'`)이 만들어진다. */
export const useLoginByShareCode = () => {
  const { clearSessionCache } = useMeCache();

  const { mutateAsync, isPending } = useLoginByShareCodeMutation({
    onSuccess: () => clearSessionCache(),
  });

  return {
    loginByShareCode: (shareCode: string): Promise<UserInfo> =>
      mutateAsync({ input: { shareCode } }).then((data) => data.loginByShareCode),
    isLoggingIn: isPending,
  };
};

/** 로그아웃 — 서버가 refresh 토큰 패밀리를 폐기하고 쿠키를 삭제한다. */
export const useLogout = () => {
  const { clearSessionCache } = useMeCache();

  const { mutateAsync, isPending } = useLogoutMutation({
    onSuccess: () => clearSessionCache(),
  });

  return {
    logout: () => mutateAsync({}),
    isLoggingOut: isPending,
  };
};

/**
 * 세션 수동 갱신.
 *
 * 보통은 필요 없다 — 서버 `buildAuthContext` 가 access 만료 시 refresh 쿠키로 자동 회전한다.
 * 명시적으로 세션을 되살려야 하는 지점(예: 장시간 백그라운드 복귀)에서만 쓴다.
 */
export const useRefreshSession = () => {
  const { invalidateMe } = useMeCache();

  const { mutateAsync, isPending } = useRefreshSessionMutation({
    onSuccess: () => invalidateMe(),
  });

  return {
    refreshSession: () => mutateAsync({}),
    isRefreshing: isPending,
  };
};
