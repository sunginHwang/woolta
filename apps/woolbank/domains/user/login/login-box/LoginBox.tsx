import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  title: string;
  type: 'normal' | 'social';
  children: ReactNode;
}

/**
 * 로그인 박스 영역 디자인
 * @component
 */

export const LoginBox: FC<Props> = ({ title, type, children }) => {
  return (
    <SC.LoginBox>
      <h3>{title}</h3>
      {type === 'social' && <SC.ButtonArea>{children}</SC.ButtonArea>}
      {type === 'normal' && <SC.NormalArea>{children}</SC.NormalArea>}
    </SC.LoginBox>
  );
};

const SC = {
  LoginBox: styled.div`
    margin-bottom: 4rem;

    > h3 {
      font-size: 1.6rem;
      margin: 2rem 0 1.5rem 0;
      color: ${({ theme }) => theme.colors.gray600};
    }
  `,
  ButtonArea: styled.div`
    display: flex;
    justify-content: space-around;
  `,
  NormalArea: styled.div`
    div + div {
      margin-top: 2rem;
    }

    > button {
      margin-top: 3em;
      height: 5.5rem;
    }
  `,
};
