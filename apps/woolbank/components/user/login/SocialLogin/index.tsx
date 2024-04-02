import { ReactFacebookFailureResponse, ReactFacebookLoginInfo } from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import KaKaoLogin from 'react-kakao-login';

import { useAlert } from '../../../..//hooks/useAlert';
import { LoginBox } from '../LoginBox';
import { useSocialLogin } from './hooks/useSocialLogin';
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
  const { socialLoginMutate } = useSocialLogin();

  const onLoginFailure = () => {
    onAlert('로그인 실패');
  };

  /**
   * facebook 간편 로그인 성공 콜백
   */
  const onFacebookLogin = (facebookResponse: ReactFacebookLoginInfo | ReactFacebookFailureResponse) => {
    const response = facebookResponse as ReactFacebookLoginInfo;

    const isFacebookLoginSuccess = (response: ReactFacebookLoginInfo) => {
      return response.id !== undefined;
    };

    if (!isFacebookLoginSuccess(response)) {
      onAlert('페이스북 로그인 실패');
      return null;
    }

    socialLoginMutate.mutate({
      name: response.name || '',
      email: response.email || '',
      imageUrl: response.picture?.data.url || '',
      socialId: response.id,
      loginType: 'facebook',
    });
  };

  /**
   * google 간편 로그인 성공 콜백
   */
  const onGoogleLogin = (googleResponse: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    const response = googleResponse as GoogleLoginResponse;
    const isGoogleLoginSuccess = (response: GoogleLoginResponse) => {
      return response.tokenId !== undefined;
    };

    if (!isGoogleLoginSuccess(response)) {
      onAlert('구글 로그인 실패');
      return null;
    }

    socialLoginMutate.mutate({
      name: response.profileObj.name,
      email: response.profileObj.email,
      imageUrl: response.profileObj.imageUrl,
      socialId: response.profileObj.googleId,
      loginType: 'google',
    });
  };

  return (
    <LoginBox title='소셜 로그인 하기' type='social'>
      <FacebookLogin
        appId={socialAuthKey.facebook}
        fields='name,email,picture'
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-expect-error
        render={(renderProps) => <SocialLoginButton provider='facebook' handleLoginClick={renderProps.onClick} />}
        callback={onFacebookLogin}
      />
      <GoogleLogin
        clientId={socialAuthKey.google}
        cookiePolicy='single_host_origin'
        render={(renderProps) => <SocialLoginButton provider='google' handleLoginClick={renderProps.onClick} />}
        onSuccess={onGoogleLogin}
        onFailure={onLoginFailure}
      />
      <KaKaoLogin
        token={socialAuthKey.kakaoTalk}
        needProfile={true}
        render={(renderProps) => <SocialLoginButton provider='kakaoTalk' handleLoginClick={renderProps.onClick} />}
        onSuccess={({ profile }) => {
          socialLoginMutate.mutate({
            name: profile?.properties.nickname || '',
            email: profile?.kakao_account.email || '',
            imageUrl: profile?.properties?.thumbnail_image_url || '',
            socialId: String(profile?.id),
            loginType: 'kakaoTalk',
          });
        }}
        onFail={onLoginFailure}
      />
    </LoginBox>
  );
}

export default SocialLogin;
