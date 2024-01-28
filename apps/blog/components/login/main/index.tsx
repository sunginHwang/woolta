import { useInputs } from '@common';
import { styled } from 'styled-components';
import { useLogin } from 'apps/blog/hooks/queries/useLogin';
import layouts from 'apps/blog/style/layouts';

const Login = () => {
  const [loginForm, onChange] = useInputs({ id: '', password: '' });
  const { login } = useLogin();

  const handleLogin = () => {
    if (loginForm.id === '') {
      alert('아이디를 입력해 주세요.');
      return;
    }

    if (loginForm.password === '') {
      alert('암호를 입력해 주세요.');
      return;
    }
    login(loginForm.id, loginForm.password);
  };

  return (
    <SC.Container>
      <SC.Title>로그인 후 포스팅 해봐요!</SC.Title>
      <SC.Form>
        <input placeholder='Id' name='id' value={loginForm.id} onChange={onChange} />
        <input placeholder='Password' name='password' value={loginForm.password} type='password' onChange={onChange} />
      </SC.Form>
      <SC.Button onClick={handleLogin}>로그인</SC.Button>
    </SC.Container>
  );
};

export default Login;

const SC = {
  Container: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 9.6rem;
    margin-bottom: 48rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      margin-top: 3.2rem;
    }

    @media screen and (max-width: ${layouts.mobileWidth}) {
      max-width: 100%;
    }
  `,
  Title: styled.div`
    color: ${({ theme }) => theme.colors.green200};
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 3.2rem;

    @media screen and (max-width: ${layouts.mobileWidth}) {
      font-size: 2rem;
    }
  `,
  Form: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    max-width: 45rem;

    input {
      font-size: 2rem;
      width: 100%;
      height: 4.8rem;
      margin-bottom: 1.6rem;
      outline-style: none;
      color: ${(props) => props.theme.colors.green200};
      background-color: ${(props) => props.theme.colors.white};
      border: none;
      border-bottom: 0.2rem solid ${(props) => props.theme.colors.gray300};

      @media screen and (max-width: ${layouts.mobileWidth}) {
        font-size: 1.5rem;
        width: 80%;
      }
    }
  `,
  Button: styled.button`
    width: 100%;
    max-width: 45rem;
    margin-top: 3.2rem;
    font-size: 2rem;
    outline-style: none;
    border-radius: 3rem;
    height: 4.8rem;
    color: ${(props) => props.theme.colors.green200};
    border: 0.1rem solid ${(props) => props.theme.colors.green200};
    text-align: center;
    font-weight: bold;
    background-color: ${(props) => props.theme.colors.white};

    @media screen and (max-width: ${layouts.mobileWidth}) {
      margin-top: 2rem;
      width: 80%;
    }
  `,
};
