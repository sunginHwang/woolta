'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

/**
 * 가계부 리스트 하단 여백
 * @component
 */
export const Footer = () => {
  return <footer {...stylex.props(styles.footer)} />;
};

const styles = stylex.create({
  footer: {
    width: '100%',
    height: '18rem',
    backgroundColor: colorVars['--color-white'],
  },
});
