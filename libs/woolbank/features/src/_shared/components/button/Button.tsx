'use client';

import { typography } from '@wds';
import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ClipLoader } from 'react-spinners';
import { styled, useTheme } from 'styled-components';

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
      className = 'test',
      startIcon,
      endIcon,
      children,
      color: _color,
      ...props
    },
    ref,
  ) => {
    const {
      colors: { white },
    } = useTheme();

    const buttonClassName = ['button-info', variant, size, className].join(' ');

    return (
      <SC.BaseButton $isFull={fill}>
        <button disabled={disabled} className={buttonClassName} ref={ref} {...props}>
          {!loading && (
            <>
              {startIcon}
              {children}
              {endIcon}
            </>
          )}
          {loading && (
            <SC.Loading>
              <ClipLoader color={white} size={20} />
            </SC.Loading>
          )}
        </button>
      </SC.BaseButton>
    );
  },
);

const SC = {
  BaseButton: styled.div<{ $isFull?: boolean }>`
    ${({ $isFull }) => $isFull && 'width: 100%;'}
    .button-info {
      ${({ $isFull }) => $isFull && 'width: 100%;'}
      border-radius: 0.8rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      position: relative;
      vertical-align: middle;

      > svg {
        margin: 0 4px;
      }
    }

    &:enabled {
      &:active {
        opacity: 0.7;
      }
    }

    .large {
      min-width: 47px;
      height: 52px;
      padding: 0 24px;
      ${typography.title4Medium};
    }

    .medium {
      min-width: 58px;
      height: 42px;
      padding: 0 16px;
      ${typography.title5Medium};
    }

    .small {
      min-width: 63px;
      height: 36px;
      padding: 0 12px;
      ${typography.body4Medium};
    }

    .primary {
      color: ${({ theme }) => theme.colors.white};
      background-color: ${({ theme }) => theme.colors.orangePrimary};
      border: 1px solid ${({ theme }) => theme.colors.orangePrimary};

      &:disabled {
        opacity: 0.3;
      }
    }

    .tertiaryColor {
      color: ${({ theme }) => theme.colors.orangePrimary};
      background-color: ${({ theme }) => theme.colors.white};
      border: 1px solid ${({ theme }) => theme.colors.orangePrimary};

      &:disabled {
        color: ${({ theme }) => theme.colors.orange500};
        border: 1px solid ${({ theme }) => theme.colors.orange500};
        background-color: ${({ theme }) => theme.colors.white};
      }
    }

    .tertiaryGray {
      color: ${({ theme }) => theme.colors.gray600};
      background-color: ${({ theme }) => theme.colors.white};
      border: 1px solid ${({ theme }) => theme.colors.border2};

      &:disabled {
        color: ${({ theme }) => theme.colors.gray300};
      }
    }

    .secondaryGray {
      color: ${({ theme }) => theme.colors.graySecondary};
      background-color: ${({ theme }) => theme.colors.bgSecondary};
      border: 1px solid ${({ theme }) => theme.colors.bgSecondary};

      &:enabled {
        &:hover {
          background-color: ${({ theme }) => theme.colors.gray100};
        }

        &:disabled {
          color: ${({ theme }) => theme.colors.gray100};
        }
      }
    }
  `,
  Loading: styled.div`
    position: absolute;
    visibility: visible;
    display: flex;
    left: 50%;
    transform: translate(-50%);
    width: 40px;
  `,
};