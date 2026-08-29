import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import type { InputHTMLAttributes } from 'react';

const styles = stylex.create({
  container: {
    transitionProperty: 'background-color',
    transitionDuration: '300ms',
    position: 'relative',
    width: '4.1rem',
    height: '2rem',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    padding: '2px',
    '::before': {
      transitionProperty: 'transform',
      transitionDuration: '300ms',
      content: '""',
      width: '1.8rem',
      height: '1.8rem',
      backgroundColor: colorVars['--color-white'],
      borderRadius: '100%',
    },
  },
  containerChecked: {
    backgroundColor: colorVars['--color-orangePrimary'],
    '::before': {
      transform: 'translateX(120%)',
    },
  },
  containerUnchecked: {
    backgroundColor: colorVars['--color-gray200'],
    '::before': {
      transform: 'translateX(0)',
    },
  },
  containerEnabled: {
    opacity: 1,
  },
  containerDisabled: {
    opacity: 0.4,
  },
  checkbox: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    opacity: 0,
    cursor: 'pointer',
    zIndex: 1,
  },
});

export const Switch = ({ className, style, checked, disabled, ...rest }: InputHTMLAttributes<HTMLInputElement>) => {
  const sx = stylex.props(
    styles.container,
    checked ? styles.containerChecked : styles.containerUnchecked,
    disabled ? styles.containerDisabled : styles.containerEnabled,
  );
  return (
    <div style={{ ...sx.style, ...style }} className={className ? `${sx.className ?? ''} ${className}` : sx.className}>
      <input {...rest} {...stylex.props(styles.checkbox)} type='checkbox' checked={checked} disabled={disabled} />
    </div>
  );
};
