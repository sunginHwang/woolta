'use client';

import { useInputs } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useLogin } from '../../../hooks/queries/useLogin';

const styles = stylex.create({
  container: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: {
      default: '9.6rem',
      '@media screen and (max-width: 1024px)': '3.2rem',
    },
    marginBottom: '48rem',
    maxWidth: {
      default: null,
      '@media screen and (max-width: 1024px)': '100%',
    },
  },
  title: {
    color: colorVars['--color-green200'],
    fontSize: {
      default: '2.5rem',
      '@media screen and (max-width: 1024px)': '2rem',
    },
    fontWeight: 'bold',
    marginBottom: '3.2rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    maxWidth: '45rem',
  },
  input: {
    fontSize: {
      default: '2rem',
      '@media screen and (max-width: 1024px)': '1.5rem',
    },
    width: {
      default: '100%',
      '@media screen and (max-width: 1024px)': '80%',
    },
    height: '4.8rem',
    marginBottom: '1.6rem',
    outlineStyle: 'none',
    color: colorVars['--color-green200'],
    backgroundColor: colorVars['--color-white'],
    borderStyle: 'none',
    borderBottomWidth: '0.2rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray300'],
  },
  button: {
    width: {
      default: '100%',
      '@media screen and (max-width: 1024px)': '80%',
    },
    maxWidth: '45rem',
    marginTop: {
      default: '3.2rem',
      '@media screen and (max-width: 1024px)': '2rem',
    },
    fontSize: '2rem',
    outlineStyle: 'none',
    borderRadius: '3rem',
    height: '4.8rem',
    color: colorVars['--color-green200'],
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-green200'],
    textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: colorVars['--color-white'],
  },
});

export const Login = () => {
  const { inputs, onChange } = useInputs({ id: '', password: '' });
  const { login } = useLogin();

  const handleLogin = () => {
    if (inputs.id === '') {
      alert('아이디를 입력해 주세요.');
      return;
    }

    if (inputs.password === '') {
      alert('암호를 입력해 주세요.');
      return;
    }
    login(inputs.id, inputs.password);
  };

  return (
    <div {...stylex.props(styles.container)}>
      <div {...stylex.props(styles.title)}>로그인 후 포스팅 해봐요!</div>
      <div {...stylex.props(styles.form)}>
        <input {...stylex.props(styles.input)} placeholder='Id' name='id' value={inputs.id} onChange={onChange} />
        <input
          {...stylex.props(styles.input)}
          placeholder='Password'
          name='password'
          value={inputs.password}
          type='password'
          onChange={onChange}
        />
      </div>
      <button {...stylex.props(styles.button)} onClick={handleLogin}>
        로그인
      </button>
    </div>
  );
};
