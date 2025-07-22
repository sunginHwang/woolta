import { useInterval } from '@common';
import React, { useState } from 'react';
import styled from 'styled-components';

import mainImage from '@/image/main_image.svg';

const INTERVAL_TIME = 500;

/**
 * 앱 구동시 cra 로 인한 초기 splash 대체 화면
 * @component
 */
export const Splash = () => {
  const [dot, setDot] = useState('.');

  useInterval(() => {
    setDot(dot === '...' ? '.' : dot + '.');
  }, INTERVAL_TIME);

  return (
    <SC.Splash>
      <img src={mainImage} alt='스플래시이미지' />
      <SC.Text>
        <p>잠시만 기다려주세요{dot}</p>
      </SC.Text>
    </SC.Splash>
  );
};

const SC = {
  Splash: styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};

    img {
      width: 10rem;
      height: 10rem;
    }
  `,
  Text: styled.div`
    width: 100%;
    margin-top: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: ${({ theme }) => theme.colors.gray700};
  `,
};
