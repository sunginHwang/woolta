'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';

const styles = stylex.create({
  footer: {
    width: '100%',
    height: '18rem',
    backgroundColor: colorVars['--color-white'],
  },
});

/**
 * 가계부
 * @component
 */
export const Footer = () => {
  return <footer {...stylex.props(styles.footer)} />;
};
