'use client';

import { type SocialLoginType, useLoginBySocial } from '@woolta/user-features';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAlert } from '../../../../../../hooks/useAlert';
import { LoadingAtom } from '../../../../../../store/layout';

export interface SocialUser {
  /**
   * provider 가 발급한 토큰. GOOGLE = id_token, KAKAO_TALK = access token.
   *
   * 서버가 이 토큰을 provider 에 되물어 검증하고, 거기서 확인된 식별자만 socialId 로 쓴다.
   * 레거시 REST 처럼 클라이언트가 socialId 를 직접 보내지 않는다.
   */
  token: string;
  loginType: SocialLoginType;
  /** provider 프로필에서 채우는 보조 정보 — 서버 검증 대상이 아니다. */
  name?: string;
  email?: string;
  imageUrl?: string;
}

export const useSocialLogin = () => {
  const { onAlert } = useAlert();
  const router = useRouter();
  const setLoading = useSetAtom(LoadingAtom);
  const { loginBySocial, isLoggingIn } = useLoginBySocial();

  const login = async (user: SocialUser) => {
    try {
      await loginBySocial(user);
      // 세션 캐시는 useLoginBySocial 이 비운다.
      router.replace('/');
    } catch {
      onAlert('다시 로그인 해 주세요.');
    }
  };

  useEffect(() => {
    if (isLoggingIn) {
      setLoading({ isLoading: true, message: '로그인중입니다. 잠시만 기다려주세요.' });
    } else {
      setLoading({ isLoading: false, message: '' });
    }
  }, [isLoggingIn, setLoading]);

  return { login, isLoggingIn };
};
