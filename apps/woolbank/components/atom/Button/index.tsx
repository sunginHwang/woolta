import { css } from '@emotion/react';

import styled from '@emotion/styled';
import { typography } from '@wds';
import React, { ButtonHTMLAttributes, ReactNode, useRef } from 'react';

export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonVariant = 'primary' | 'tertiaryColor' | 'tertiaryGray' | 'secondaryGray';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * 전체 영역 버튼 유무를 정의합니다.
   * @default false
   */
  fill?: boolean;
  /**
   * 버튼 variant 를 선택합니다.
   * @default primary
   */
  variant?: ButtonVariant;
  /**
   * 버튼 크기를 정의합니다.
   * @default medium
   */
  size?: ButtonSize;
  /**
   * 버튼 텍스트 좌측의 아이콘을 넣을 수 있습니다.
   */
  startIcon?: ReactNode;
  /**
   * 버튼 텍스트 우측의 아이콘을 넣을 수 있습니다.
   */
  endIcon?: ReactNode;
  /**
   * 버튼에서 로딩 프로그레스 바를 보여줍니다.
   * @default false
   */
  loading?: boolean;
  /**
   * 버튼 비활성화 유무를 정의합니다.
   * @default false
   */
  disabled?: boolean;
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
      ...props
    },
    ref,
  ) => {
    const loading_ref = useRef<HTMLDivElement>(null);

    const buttonStyle = [
      css`
        ${fill && 'width: 100%;'}
        cursor: ${disabled ? 'not-allowed' : 'pointer'};
      `,
    ];

    const buttonClassName = ['button-info', variant, size, className].join(' ');

    return (
      <SC.BaseButton disabled={disabled} fill={fill} css={buttonStyle} {...props} ref={ref}>
        <div className={buttonClassName}>
          {!loading && (
            <>
              {startIcon}
              {children}
              {endIcon}
            </>
          )}
          {loading && (
            <SC.Loading>
              <div ref={loading_ref} />
            </SC.Loading>
          )}
        </div>
      </SC.BaseButton>
    );
  },
);

const SC = {
  BaseButton: styled.button<{ fill?: boolean }>`
    ${({ fill }) => fill && 'width: 100%;'}
    .button-info {
      ${({ fill }) => fill && 'width: 100%;'}
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
    /* border-radius: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    vertical-align: middle;

    > svg {
      margin: 0 4px;
    }

    &:focus {
      outline: 0;
    } */

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
    margin-bottom: 10px;
  `,
};
