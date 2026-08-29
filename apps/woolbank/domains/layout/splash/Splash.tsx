import { useInterval } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import React, { useState } from 'react';

import mainImage from '@/image/main_image.svg';

const INTERVAL_TIME = 500;

const styles = stylex.create({
  splash: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-white'],
  },
  splashImage: {
    width: '10rem',
    height: '10rem',
  },
  text: {
    width: '100%',
    marginTop: '5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    color: colorVars['--color-gray700'],
  },
});

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
    <div {...stylex.props(styles.splash)}>
      <img {...stylex.props(styles.splashImage)} src={mainImage} alt='스플래시이미지' />
      <div {...stylex.props(styles.text)}>
        <p>잠시만 기다려주세요{dot}</p>
      </div>
    </div>
  );
};
