import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { ColorType, colors } from 'apps/blog/style/colors';
import { FontVarient, typography } from 'apps/blog/style/font';
import React, { FC } from 'react';

type Alignment = 'left' | 'center' | 'right';

type TextElement = keyof Pick<
  JSX.IntrinsicElements,
  'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div' | 'span' | 'li'
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
   * @default 'small1_regular'
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
 * 공통 Text 컴포넌트
 * @component
 */
const Text: FC<BaseTextProps & JSX.IntrinsicElements[NonNullable<BaseTextProps['as']>]> = ({
  as = 'span',
  variant,
  children,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Base as={as} variant={variant} theme={theme} {...props}>
      {children}
    </Base>
  );
};

export default Text;

const Base = styled.span<BaseTextProps>`
  ${({ variant }) => typography[variant]};
  ${({ color, theme }) => color && `color: ${theme.colors[color]}`};
  ${({ alignment = 'left' }) => `text-align: ${alignment}`};
  ${({ mt = 0, ml = 0, mb = 0, mr = 0 }) => `margin: ${mt}px ${mr}px ${mb}px ${ml}px`}
`;
