import GoogleLogin, { type GoogleLoginResponse, type GoogleLoginResponseOffline } from '@dump-work/react-google-login';
import type { ReactFacebookFailureResponse, ReactFacebookLoginInfo } from 'react-facebook-login';
// import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import KaKaoLogin from 'react-kakao-login';

import { useAlert } from '../../../../hooks/useAlert';
import { LoginBox } from '../login-box/LoginBox';
import { useSocialLogin } from './_common/hooks/useSocialLogin';
import { SocialLoginButton } from './SocialLoginButton';

const socialAuthKey = {
  kakaoTalk: 'd35244b490fa1937d657994fc0f70b60',
  google: '922918112483-2p3e9084urmsn3fkfptekave3h9t3i3d.apps.googleusercontent.com',
  facebook: '579803506023154',
};

/**
 * 소셜 로그인
 * @component
 */

function SocialLogin() {
  const { onAlert } = useAlert();
  const { login } = useSocialLogin();

  const onLoginFailure = () => {
    onAlert('로그인 실패');
  };

  const handleFacebookLogin = (facebookResponse: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    const response = facebookResponse as ReactFacebookLoginInfo;

    const isFacebookLoginSuccess = (response: ReactFacebookLoginInfo) => {
      return response.id !== undefined;
    };

    if (!isFacebookLoginSuccess(response)) {
      onAlert('페이스북 로그인 실패');
      return null;
    }

    login({
      token: response.accessToken,
      loginType: 'FACEBOOK',
      name: response.name,
      email: response.email,
      imageUrl: response.picture?.data.url,
    });
  };

  const handleGoogleLogin = (googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const response = googleResponse as GoogleLoginResponse;

    /**
     * 서버는 GOOGLE 을 id_token 으로 검증한다.
     *
     * 이 포크(@dump-work)는 내부를 GIS(accounts.google.com/gsi/client)로 갈아끼우면서 성공 콜백이
     * `profileObj` 와 `tokenObj.id_token` **둘만** 채운다 — `tokenId` 는 설정하지 않는다.
     * 그런데 동봉된 index.d.ts 는 gapi.auth2 시절 그대로라 `tokenId: string` 으로 선언돼 있어
     * 타입체크를 통과한 채 undefined 가 그대로 넘어갔다(= 운영에서 token 없이 요청이 나갔다).
     * 타입을 믿지 말고 실제로 값이 오는 자리를 먼저 본다.
     */
    const idToken = response.tokenObj?.id_token ?? response.tokenId;

    if (!idToken) {
      onAlert('구글 로그인 실패');
      return null;
    }

    login({
      token: idToken,
      loginType: 'GOOGLE',
      name: response.profileObj.name,
      email: response.profileObj.email,
      imageUrl: response.profileObj.imageUrl,
    });
  };

  return (
    <LoginBox title='소셜 로그인 하기' type='social'>
      {/* //TODO facebook 로그인 추후 추가 */}
      {/* <FacebookLogin
        appId={socialAuthKey.facebook}
        fields='name,email,picture'
        render={(renderProps) => <SocialLoginButton provider='facebook' handleLoginClick={renderProps.onClick} />}
        callback={handleFacebookLogin}
      /> */}
      <GoogleLogin
        clientId={socialAuthKey.google}
        cookiePolicy='single_host_origin'
        render={(renderProps) => <SocialLoginButton provider='google' handleLoginClick={renderProps.onClick} />}
        onSuccess={handleGoogleLogin}
        onFailure={onLoginFailure}
      />
      <KaKaoLogin
        token={socialAuthKey.kakaoTalk}
        needProfile={true}
        render={(renderProps) => <SocialLoginButton provider='kakaoTalk' handleLoginClick={renderProps.onClick} />}
        onSuccess={({ response, profile }) => {
          login({
            // 서버는 KAKAO_TALK 을 access token 으로 검증한다.
            token: response.access_token,
            loginType: 'KAKAO_TALK',
            name: profile?.properties.nickname,
            email: profile?.kakao_account.email,
            imageUrl: profile?.properties?.thumbnail_image_url,
          });
        }}
        onFail={onLoginFailure}
      />
    </LoginBox>
  );
}

export default SocialLogin;
