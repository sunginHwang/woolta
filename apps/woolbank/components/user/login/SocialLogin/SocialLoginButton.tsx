import { FC } from 'react';
import styled from 'styled-components';
import { IconFacebook, IconGoogle, IconKakaoTalk } from '../../../../components/atom/Icon';

const providerMap = {
  kakaoTalk: {
    color: '#ffe812',
    icon: IconKakaoTalk,
  },
  google: {
    color: 'white',
    icon: IconGoogle,
  },
  facebook: {
    color: '#3b5998',
    icon: IconFacebook,
  },
};

interface Props {
  provider: 'facebook' | 'google' | 'kakaoTalk';
  handleLoginClick: () => void;
}

/**
 * 소셜 로그인 버튼
 * @component
 */
export const SocialLoginButton: FC<Props> = ({ provider, handleLoginClick }) => {
  const socialButton = providerMap[provider];

  return (
    <SC.SocialLoginButton color={socialButton.color} onClick={handleLoginClick}>
      <socialButton.icon />
    </SC.SocialLoginButton>
  );
};

const SC = {
  SocialLoginButton: styled.button<{ color: string }>`
    width: 4.8rem;
    height: 4.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ color }) => color};
    border-radius: 2.4rem;
    outline: none;
    border: 0.1rem solid rgb(222, 226, 230);
  `,
};
