import * as stylex from '@stylexjs/stylex';
import type { FC } from 'react';
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

const styles = stylex.create({
  button: {
    width: '4.8rem',
    height: '4.8rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '2.4rem',
    outlineStyle: 'none',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: 'rgb(222, 226, 230)',
  },
});

const dynamicStyles = stylex.create({
  bgColor: (color: string) => ({ backgroundColor: color }),
});

/**
 * 소셜 로그인 버튼
 * @component
 */
export const SocialLoginButton: FC<Props> = ({ provider, handleLoginClick }) => {
  const socialButton = providerMap[provider];

  return (
    <button {...stylex.props(styles.button, dynamicStyles.bgColor(socialButton.color))} onClick={handleLoginClick}>
      <socialButton.icon />
    </button>
  );
};
