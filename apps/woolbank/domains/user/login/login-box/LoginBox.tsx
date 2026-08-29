import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import React, { type FC, type ReactNode } from 'react';

interface Props {
  title: string;
  type: 'normal' | 'social';
  children: ReactNode;
}

const styles = stylex.create({
  loginBox: {
    marginBottom: '4rem',
  },
  h3: {
    fontSize: '1.6rem',
    marginTop: '2rem',
    marginRight: 0,
    marginBottom: '1.5rem',
    marginLeft: 0,
    color: colorVars['--color-gray600'],
  },
  buttonArea: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  normalArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
});

/**
 * 로그인 박스 영역 디자인
 * @component
 */

export const LoginBox: FC<Props> = ({ title, type, children }) => {
  return (
    <div {...stylex.props(styles.loginBox)}>
      <h3 {...stylex.props(styles.h3)}>{title}</h3>
      {type === 'social' && <div {...stylex.props(styles.buttonArea)}>{children}</div>}
      {type === 'normal' && <div {...stylex.props(styles.normalArea)}>{children}</div>}
    </div>
  );
};
