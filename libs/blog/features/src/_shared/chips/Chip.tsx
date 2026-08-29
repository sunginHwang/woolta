'use client';

import { typography } from '@wds';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { styled, css, RuleSet } from 'styled-components';

type ChipVarient = 'filled' | 'outlined' | 'event';
type ChipColor = 'primary';
type ChipSize = 'small' | 'medium';

export interface ChipItem<T = string> {
  name: string;
  value: T;
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  varient?: ChipVarient;
  color?: ChipColor;
  size?: ChipSize;
  disabled?: boolean;
  start_icon?: ReactNode;
  end_icon?: ReactNode;
  onClick?: () => void;
  text?: string;
}

const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      disabled = false,
      className,
      children,
      text,
      active = false,
      size = 'small',
      varient = 'filled',
      color = 'primary',
      start_icon,
      end_icon,
      ...props
    },
    ref,
  ) => {
    const chip_style = [
      chip_size_css[size],
      getChipColorVarient(color, active)[varient],
      getIconSpace(start_icon, end_icon),
    ];

    return (
      <SC.Chip
        ref={ref}
        css={chip_style}
        className={className}
        $disabled={disabled}
        {...props}
      >
        {start_icon}
        {text}
        {end_icon}
      </SC.Chip>
    );
  },
);

function getIconSpace(start_icon?: ReactNode, end_icon?: ReactNode): RuleSet<object> {
  if (start_icon && end_icon) {
    return css`
      svg {
        &:first-of-type {
          margin-right: 4px;
        }
        &:last-of-type {
          margin-left: 4px;
        }
      }
    `;
  }
  if (start_icon) {
    return css`
      svg {
        margin-right: 4px;
      }
    `;
  }
  if (end_icon) {
    return css`
      svg {
        margin-left: 4px;
      }
    `;
  }
  return css``;
}

function getChipColorVarient(color: ChipColor, active: boolean): Record<ChipVarient, RuleSet<object>> {
  switch (color) {
    case 'primary':
      return {
        filled: css`
          background-color: ${({ theme }) => (active ? theme.colors.grayActive : theme.colors.bgPrimary)};
          color: ${({ theme }) => (active ? theme.colors.white : theme.colors.graySecondary)};
          border: ${({ theme }) => `1px solid ${active ? theme.colors.grayActive : theme.colors.border3}`};
        `,
        outlined: css`
          background-color: ${({ theme }) => theme.colors.white};
          color: ${({ theme }) => (active ? theme.colors.grayActive : theme.colors.graySecondary)};
          border: ${({ theme }) => `1px solid ${active ? theme.colors.grayActive : theme.colors.border3}`};
        `,
        event: css`
          ${typography.body4Medium}
          ${event_style};
          color: ${({ theme }) => theme.colors.pinkPrimary};
          border: 1px solid transparent;
          box-shadow: 0px 2px 4px 0px #e62f7126;
          &:active {
            ${event_style};
          }
        `,
      };
  }
}

const chip_size_css: Record<ChipSize, RuleSet<object>> = {
  small: css`
    padding: 7px 12px 6px;
    height: 32px;
  `,
  medium: css`
    padding: 9px 12px 8px;
    height: 36px;
  `,
};

const event_style = css`
  background: linear-gradient(0deg, white, white) padding-box,
    linear-gradient(115.62deg, #e62f71 6.59%, #ff6d1c 45.24%, #e62fb3 88.05%) border-box;
`;

const SC = {
  Chip: styled.button<{ $disabled: boolean }>`
    ${typography.body4Medium}
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    vertical-align: middle;
    opacity: ${({ $disabled }) => ($disabled ? '0.5' : '1')};

    svg path {
      pointer-events: none;
    }
  `,
};

export default Chip;
