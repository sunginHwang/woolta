import styled from '@emotion/styled';
import { FC, HTMLAttributes } from 'react';
import animations from '../../style/animations';

interface Props extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  radius?: number;
}

export const SkeletonBar: FC<Props> = ({ width = '20rem', height = '3.2rem', radius = 3, ...rest }) => {
  return <SC.Contaienr width={width} height={height} radius={radius} {...rest} />;
};

const SC = {
  Contaienr: styled.div<{ width: string; height: string; radius: number }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    animation: ${animations.loading} 1.3s infinite ease-in-out;
    border-radius: ${({ radius }) => radius}px;
  `,
};
