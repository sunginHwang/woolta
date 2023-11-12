import { css, SerializedStyles } from '@emotion/react';
import styled from '@emotion/styled';
import { bgPrimary, border3, grayActive, graySecondary, pinkPrimary, white } from 'apps/blog/style/colors';
import { typography } from 'apps/blog/style/font';
import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';

type ChipVarient = 'filled' | 'outlined' | 'event';
type ChipColor = 'primary';
type ChipSize = 'small' | 'medium';

export interface ChipItem<T = string> {
  name: string;
  value: T;
}

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * active 상태 여부를 지정합니다.
   * @default false
   */
  active?: boolean;
  /**
   * varient 여부를 지정합니다.
   * @default filled
   */
  varient?: ChipVarient;
  /**
   * 색상 값을 지정합니다.
   * @default primary
   */
  color?: ChipColor;
  /**
   * chip 크기를 지정 합니다.
   * @default medium
   */
  size?: ChipSize;
  /**
   * chip 비활성화 여부를 정의합니다.
   * @default false
   */
  disabled?: boolean;
  /**
   * Chip 텍스트 좌측의 아이콘을 넣을 수 있습니다.
   */
  start_icon?: ReactNode;
  /**
   * Chip 텍스트 우측의 아이콘을 넣을 수 있습니다.
   */
  end_icon?: ReactNode;
  /**
   * chip을 눌렀을때 동작하는 함수를 정의합니다.
   * @default () => {}
   */
  onClick?: () => void;
  /**
   * chip안에 포함되는 text를 정의합니다.
   * @default ''
   */
  text?: string;
}

/**
 * 공통 Chip 컴포넌트
 * @component
 */
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
        disabled={disabled}
        active={active && !disabled}
        {...props}
      >
        {start_icon}
        {text}
        {end_icon}
      </SC.Chip>
    );
  },
);

function getIconSpace(start_icon?: ReactNode, end_icon?: ReactNode): SerializedStyles {
  if (start_icon && end_icon) {
    return css`
      svg {
        &:fitst-of-type {
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

function getChipColorVarient(color: ChipColor, active: boolean): Record<ChipVarient, SerializedStyles> {
  switch (color) {
    case 'primary':
      return {
        filled: css`
          background-color: ${active ? grayActive : bgPrimary};
          color: ${active ? white : graySecondary};
          border: ${`1px solid ${active ? grayActive : border3}`};
        `,
        outlined: css`
          background-color: white;
          color: ${active ? grayActive : graySecondary};
          border: ${`1px solid ${active ? grayActive : border3}`};
        `,
        event: css`
          ${typography.body4Medium}
          ${event_style};
          color: ${pinkPrimary};
          border: 1px solid transparent;
          box-shadow: 0px 2px 4px 0px #e62f7126;
          &:active {
            ${event_style};
          }
        `,
      };
  }
}

const chip_size_css: Record<ChipSize, SerializedStyles> = {
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
  Chip: styled.button<{ active?: boolean; disabled: boolean }>`
    ${typography.body4Medium}
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    border-radius: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    position: relative;
    vertical-align: middle;
    opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};

    svg path {
      pointer-events: none;
    }
  `,
};
export default Chip;
