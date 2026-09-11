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

    const isGoogleLoginSuccess = (response: GoogleLoginResponse) => {
      return response.tokenId !== undefined || response.tokenObj.id_token !== undefined;
    };

    if (!isGoogleLoginSuccess(response)) {
      onAlert('구글 로그인 실패');
      return null;
    }

    login({
      // 서버는 GOOGLE 을 id_token 으로 검증한다 (tokenId === tokenObj.id_token).
      token: response.tokenId,
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
