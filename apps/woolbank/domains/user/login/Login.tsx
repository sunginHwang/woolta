'use client';
import * as stylex from '@stylexjs/stylex';
import { IdLogin } from './id-login/IdLogin';
import { LoginTitle } from './login-title/LoginTitle';
import SocialLogin from './social-login/SocialLogin';

const styles = stylex.create({
  container: {
    paddingBlock: 0,
    paddingInline: '1.6rem',
  },
});

export const Login = () => {
  return (
    <div {...stylex.props(styles.container)}>
      <LoginTitle />
      <IdLogin />
      <SocialLogin />
    </div>
  );
};
