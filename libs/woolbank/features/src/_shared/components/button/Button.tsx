'use client';

import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonVariant = 'primary' | 'tertiaryColor' | 'tertiaryGray' | 'secondaryGray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  fill?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  color?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      size = 'medium',
      variant = 'primary',
      fill,
      disabled,
      loading,
      className,
      startIcon,
      endIcon,
      children,
      color: _color,
      ...props
    },
    ref,
  ) => {
    const sx = stylex.props(
      styles.button,
      fill && styles.fill,
      size === 'large' ? styles.large : size === 'small' ? styles.small : styles.medium,
      variant === 'primary'
        ? styles.primary
        : variant === 'tertiaryColor'
        ? styles.tertiaryColor
        : variant === 'tertiaryGray'
        ? styles.tertiaryGray
        : styles.secondaryGray,
    );

    return (
      <button
        {...props}
        {...sx}
        className={className ? `${sx.className ?? ''} ${className}` : sx.className}
        disabled={disabled}
        ref={ref}
      >
        {!loading && (
          <>
            {startIcon}
            {children}
            {endIcon}
          </>
        )}
        {loading && (
          <div {...stylex.props(styles.loading)}>
            <ClipLoader color={colorVars['--color-white']} size={20} />
          </div>
        )}
      </button>
    );
  },
);

const styles = stylex.create({
  button: {
    borderRadius: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    position: 'relative',
    verticalAlign: 'middle',
    opacity: { 'default': 1, ':active': 0.7 },
  },
  fill: {
    width: '100%',
  },
  large: {
    minWidth: '47px',
    height: '52px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '24px',
    paddingRight: '24px',
  },
  medium: {
    minWidth: '58px',
    height: '42px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '16px',
    paddingRight: '16px',
  },
  small: {
    minWidth: '63px',
    height: '36px',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: '12px',
    paddingRight: '12px',
  },
  primary: {
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-orangePrimary'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-orangePrimary'],
    opacity: { 'default': 1, ':disabled': 0.3 },
  },
  tertiaryColor: {
    color: { 'default': colorVars['--color-orangePrimary'], ':disabled': colorVars['--color-orange500'] },
    backgroundColor: colorVars['--color-white'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: { 'default': colorVars['--color-orangePrimary'], ':disabled': colorVars['--color-orange500'] },
  },
  tertiaryGray: {
    color: { 'default': colorVars['--color-gray600'], ':disabled': colorVars['--color-gray300'] },
    backgroundColor: colorVars['--color-white'],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-border2'],
  },
  secondaryGray: {
    color: colorVars['--color-graySecondary'],
    backgroundColor: { 'default': colorVars['--color-bgSecondary'], ':hover': colorVars['--color-gray100'] },
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colorVars['--color-bgSecondary'],
  },
  loading: {
    position: 'absolute',
    visibility: 'visible',
    display: 'flex',
    left: '50%',
    transform: 'translate(-50%)',
    width: '40px',
  },
});
