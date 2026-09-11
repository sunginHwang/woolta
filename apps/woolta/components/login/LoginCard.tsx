'use client';

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import * as stylex from '@stylexjs/stylex';
import { Text } from '@wds';
import { colorVars } from '@wds/tokens.stylex';
import { useLoginByShareCode, useLoginBySocial } from '@woolta/user-features';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { type FormEvent, useState } from 'react';
import { FiKey } from 'react-icons/fi';
import { KAKAO_SDK_SRC, loginWithKakao } from './kakao';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '';
const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY ?? '';

const styles = stylex.create({
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100dvh',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '36rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    padding: '3.2rem 2.8rem',
    borderRadius: '1.6rem',
    backgroundColor: colorVars['--color-bgSurface'],
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  providerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  // 레일 아이템과 같은 높이 · 라운드 · hover 규칙을 따른다.
  providerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.8rem',
    height: '4.8rem',
    borderRadius: '1.2rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-borderSubtle'],
    fontSize: '1.4rem',
    fontWeight: 600,
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
  googleButton: {
    color: colorVars['--color-textPrimary'],
    backgroundColor: {
      default: colorVars['--color-bgSurface'],
      ':hover': colorVars['--color-bgSurfaceSecondary'],
    },
  },
  /** 구글 버튼은 SDK 가 렌더하므로 높이만 맞춰 담는다. */
  googleSlot: {
    display: 'flex',
    justifyContent: 'center',
    minHeight: '4.8rem',
  },
  kakaoButton: {
    color: '#191600',
    borderColor: 'transparent',
    backgroundColor: { default: '#fee500', ':hover': '#f2da00' },
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
  },
  dividerLine: {
    flex: 1,
    height: '0.1rem',
    backgroundColor: colorVars['--color-borderSubtle'],
  },
  shareForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
  },
  input: {
    height: '4.8rem',
    paddingInline: '1.4rem',
    borderRadius: '1.2rem',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: {
      default: colorVars['--color-borderSubtle'],
      ':focus': colorVars['--color-interactivePrimary'],
    },
    backgroundColor: colorVars['--color-bgPage'],
    color: colorVars['--color-textPrimary'],
    fontSize: '1.4rem',
    outline: 'none',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
    height: '4.8rem',
    borderRadius: '1.2rem',
    borderStyle: 'none',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: colorVars['--color-bgSurface'],
    backgroundColor: colorVars['--color-interactivePrimary'],
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    opacity: { default: 1, ':disabled': 0.5 },
  },
  error: {
    minHeight: '1.8rem',
  },
});

const LoginPanel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shareCode, setShareCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isKakaoPending, setIsKakaoPending] = useState(false);

  const { loginBySocial, isLoggingIn: isSocialPending } = useLoginBySocial();
  const { loginByShareCode, isLoggingIn: isSharePending } = useLoginByShareCode();

  /**
   * 게이트가 붙여준 원래 목적지. 없거나 신뢰할 수 없으면 홈.
   *
   * `/` 로 시작하는지만 보면 `//evil.com` 같은 프로토콜 상대 URL 이 통과해 외부로 튕겨나간다
   * (오픈 리다이렉트). 같은 사이트 내부 경로만 허용한다.
   */
  const goNext = () => {
    const next = searchParams.get('next');
    const isInternalPath = next?.startsWith('/') === true && !next.startsWith('//');

    router.replace(isInternalPath ? next : '/');
  };

  const toMessage = (error: unknown, fallback: string) =>
    error instanceof Error && error.message ? error.message : fallback;

  /**
   * 서버는 구글 토큰을 `tokeninfo?id_token=` 으로 검증하고 `aud` 를 확인한다 — 반드시 **id_token** 이어야 한다.
   * `@react-oauth/google` 에서 id_token(credential)을 주는 건 `<GoogleLogin>` 뿐이라
   * 구글 버튼만 SDK 가 렌더한다(브랜드 가이드도 그걸 요구한다).
   */
  const handleGoogleCredential = async (credential: string | undefined) => {
    setErrorMessage('');

    if (!credential) {
      setErrorMessage('구글 로그인에 실패했습니다.');
      return;
    }

    try {
      await loginBySocial({ token: credential, loginType: 'GOOGLE' });
      goNext();
    } catch (error) {
      setErrorMessage(toMessage(error, '구글 로그인에 실패했습니다.'));
    }
  };

  const handleKakaoLogin = async () => {
    setErrorMessage('');
    setIsKakaoPending(true);
    try {
      const token = await loginWithKakao(KAKAO_JS_KEY);
      await loginBySocial({ token, loginType: 'KAKAO_TALK' });
      goNext();
    } catch (error) {
      setErrorMessage(toMessage(error, '카카오 로그인에 실패했습니다.'));
    } finally {
      setIsKakaoPending(false);
    }
  };

  const handleShareCodeSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage('');

    if (shareCode.trim() === '') {
      setErrorMessage('공유코드를 입력해 주세요.');
      return;
    }

    try {
      await loginByShareCode(shareCode.trim());
      goNext();
    } catch (error) {
      setErrorMessage(toMessage(error, '잘못된 공유코드입니다.'));
    }
  };

  const isPending = isSocialPending || isSharePending || isKakaoPending;

  return (
    <div {...stylex.props(styles.page)}>
      <Script src={KAKAO_SDK_SRC} strategy='afterInteractive' />
      <section {...stylex.props(styles.card)}>
        <header {...stylex.props(styles.header)}>
          <Text as='h1' variant='title3Bold' color='textPrimary'>
            Woolta 대시보드
          </Text>
          <Text variant='body2' color='textSecondary' mt={8}>
            로그인하면 할 일 · 가계부 · 메모를 한곳에서 관리할 수 있어요
          </Text>
        </header>

        <div {...stylex.props(styles.providerList)}>
          {GOOGLE_CLIENT_ID === '' ? (
            // 키가 없으면 GoogleOAuthProvider 가 없어 SDK 버튼을 띄울 수 없다.
            // 버튼을 감추면 "구글 로그인이 없는 화면"으로 보이므로 비활성 상태로 자리를 지킨다.
            <button type='button' disabled {...stylex.props(styles.providerButton, styles.googleButton)}>
              구글로 로그인 (설정 필요)
            </button>
          ) : (
            <div {...stylex.props(styles.googleSlot)}>
              <GoogleLogin
                onSuccess={({ credential }) => handleGoogleCredential(credential)}
                onError={() => setErrorMessage('구글 로그인에 실패했습니다.')}
                theme='outline'
                shape='pill'
                size='large'
                width='100%'
                text='signin_with'
                locale='ko'
              />
            </div>
          )}
          <button
            type='button'
            disabled={isPending || KAKAO_JS_KEY === ''}
            onClick={handleKakaoLogin}
            {...stylex.props(styles.providerButton, styles.kakaoButton)}
          >
            카카오로 로그인
          </button>
        </div>

        <div {...stylex.props(styles.divider)}>
          <span {...stylex.props(styles.dividerLine)} />
          <Text variant='small2Regular' color='textTertiary'>
            또는
          </Text>
          <span {...stylex.props(styles.dividerLine)} />
        </div>

        <form {...stylex.props(styles.shareForm)} onSubmit={handleShareCodeSubmit}>
          <Text variant='small1Regular' color='textSecondary'>
            공유코드로 접속하면 열람만 가능합니다
          </Text>
          <input
            {...stylex.props(styles.input)}
            value={shareCode}
            onChange={(event) => setShareCode(event.target.value)}
            placeholder='공유코드'
            aria-label='공유코드'
            autoComplete='off'
          />
          <button type='submit' disabled={isPending} {...stylex.props(styles.submitButton)}>
            <FiKey size={16} />
            공유코드로 접속
          </button>
        </form>

        <div {...stylex.props(styles.error)} role='alert' aria-live='polite'>
          {errorMessage !== '' && (
            <Text variant='small2Regular' color='red500'>
              {errorMessage}
            </Text>
          )}
        </div>
      </section>
    </div>
  );
};

/**
 * 소셜 provider 키는 공개 값이지만 앱마다 다를 수 있어 env 로 받는다.
 * bank 는 소스에 하드코딩해 뒀다(`SocialLogin.tsx`) — 그 방식을 따르지 않는다.
 */
export const LoginCard = () => {
  if (GOOGLE_CLIENT_ID === '') {
    // clientId 없이 GoogleOAuthProvider 를 띄우면 SDK 초기화가 실패한다.
    // 공유코드 로그인은 계속 쓸 수 있어야 하므로 provider 없이 렌더한다.
    return <LoginPanel />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LoginPanel />
    </GoogleOAuthProvider>
  );
};
