'use client';
import styled from 'styled-components';
import { IdLogin } from './id-login/IdLogin';
import { LoginTitle } from './login-title/LoginTitle';
import SocialLogin from './social-login/SocialLogin';

export const Login = () => {
  return (
    <SC.Container>
      <LoginTitle />
      <IdLogin />
      <SocialLogin />
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    padding: 0 1.6rem;
  `,
};
