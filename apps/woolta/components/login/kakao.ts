/**
 * 카카오 공식 JS SDK 최소 타입.
 *
 * bank 는 `react-kakao-login` 래퍼를 쓰지만 그 패키지는 선언 없이 호이스팅으로 들어와 있다.
 * 대시보드는 의존성을 늘리지 않고 공식 SDK 를 next/script 로 직접 로드한다.
 */
/**
 * 카카오가 문서에서 제공하는 무버전 엔드포인트.
 *
 * TODO: 카카오 문서의 버전 고정 URL(`t1.kakaocdn.net/kakao_js_sdk/<version>/kakao.min.js`)과
 *       그 버전에 대응하는 integrity 해시로 바꾸는 게 안전하다. 해시는 반드시 카카오 문서에서
 *       그대로 옮겨와야 한다 — 값이 틀리면 브라우저가 스크립트를 아예 차단한다.
 */
export const KAKAO_SDK_SRC = 'https://developers.kakao.com/sdk/js/kakao.js';

interface KakaoLoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

interface KakaoSdk {
  init: (jsKey: string) => void;
  isInitialized: () => boolean;
  Auth: {
    login: (params: {
      success: (response: KakaoLoginResponse) => void;
      fail: (error: { error: string; error_description?: string }) => void;
      scope?: string;
    }) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

/**
 * SDK 로드 완료 후 1회 초기화한다.
 * 스크립트 onLoad 보다 사용자의 버튼 클릭이 먼저일 수 있어 호출 시점에 확인한다.
 */
export const getKakao = (jsKey: string): KakaoSdk | null => {
  const kakao = typeof window === 'undefined' ? undefined : window.Kakao;

  if (!kakao) {
    return null;
  }

  if (!kakao.isInitialized()) {
    kakao.init(jsKey);
  }

  return kakao;
};

/** 카카오 로그인 → provider access token. 서버가 이 토큰을 카카오에 되물어 검증한다. */
export const loginWithKakao = (jsKey: string) =>
  new Promise<string>((resolve, reject) => {
    const kakao = getKakao(jsKey);

    if (!kakao) {
      reject(new Error('카카오 로그인을 준비하지 못했습니다. 잠시 후 다시 시도해 주세요.'));
      return;
    }

    kakao.Auth.login({
      success: ({ access_token }) => resolve(access_token),
      fail: (error) => reject(new Error(error.error_description ?? '카카오 로그인에 실패했습니다.')),
    });
  });
