import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  message: string;
}

export const Empty: FC<Props> = ({ message }) => {
  return <SC.EmptyList>{message}</SC.EmptyList>;
};

const SC = {
  EmptyList: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray600};
    font-size: 1.8rem;
    height: 30%;
  `,
};
