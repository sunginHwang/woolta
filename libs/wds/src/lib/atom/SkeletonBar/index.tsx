import styled from '@emotion/styled';
import animations from '../../style/animations';
import { FC } from 'react';

interface Props {
  width?: string;
  height?: string;
  radius?: number;
}

export const SkeletonBar: FC<Props> = ({ width = '20rem', height = '3.2rem', radius = 3 }) => {
  return <SC.Contaienr width={width} height={height} radius={radius} />;
};

const SC = {
  Contaienr: styled.div<{ width: string; height: string; radius: number }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    animation: ${animations.loading} 1.3s infinite ease-in-out;
    border-radius: ${({ radius }) => radius}px;
    margin-bottom: 0.5rem;
  `,
};
