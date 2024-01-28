import React, { FC } from 'react';
import { styled } from 'styled-components';
import { ColorType, FontVarient, typography } from '../../style';

type Alignment = 'left' | 'center' | 'right';

type TextElement = keyof Pick<
  JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span' | 'li' | 'label'
>;

export interface BaseTextProps extends React.Attributes {
  /**
   * text 위치를 설정 합니다.
   * @default 'left'
   */
  alignment?: Alignment;
  /**
   * text 컴포넌트 종류를 선택 합니다.
   * @default 'span'
   */
  as?: TextElement;
  /**
   * text 색상을 선택합니다.
   * @default 'black'
   */
  color?: ColorType;
  /**
   * text 타입을 정의 합니다.
   */
  variant: FontVarient;
  /**
   * margin-top 값을 정의합니다.(px 단위)
   * @default 0
   */
  mt?: number;
  /**
   * margin-right 값을 정의합니다.(px 단위)
   * @default 0
   */
  mr?: number;
  /**
   * margin-bottom 값을 정의합니다.(px 단위)
   * @default 0
   */
  mb?: number;
  /**
   * margin-left 값을 정의합니다.(px 단위)
   * @default 0
   */
  ml?: number;
}

/**
 * Text 컴포넌트
 * @component
 */
export const Text: FC<BaseTextProps & JSX.IntrinsicElements[NonNullable<BaseTextProps['as']>]> = ({
  as = 'span',
  variant,
  children,
  ...props
}) => {
  return (
    <Base as={as} variant={variant} {...props}>
      {children}
    </Base>
  );
};

const Base = styled.span<BaseTextProps>`
  ${({ variant }) => typography[variant]};
  ${({ color, theme }) => color && `color: ${theme.colors[color]}`};
  ${({ alignment = 'left' }) => `text-align: ${alignment}`};
  ${({ mt = 0, ml = 0, mb = 0, mr = 0 }) => `margin: ${mt}px ${mr}px ${mb}px ${ml}px;`}
`;
