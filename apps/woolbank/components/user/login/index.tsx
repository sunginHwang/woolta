import styled from 'styled-components';
import { IdLogin } from './IdLogin';
import { LoginTitle } from './LoginTitle';
// import SocialLogin from './SocialLogin';

export const Login = () => {
  return (
    <SC.Container>
      <LoginTitle />
      <IdLogin />
      {/* <SocialLogin /> */}
    </SC.Container>
  );
};

const SC = {
  Container: styled.div`
    padding: 0 1.6rem;
  `,
};
