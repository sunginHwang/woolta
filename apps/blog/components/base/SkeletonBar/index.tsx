import styled from '@emotion/styled';
import animations from 'apps/blog/style/animations';

type Props = {
  width?: string;
  height?: string;
  radius?: number;
};

function SkeletonBar({ width = '20rem', height = '3.2rem', radius = 3 }: Props) {
  return <SC.Contaienr width={width} height={height} radius={radius} />;
}

export default SkeletonBar;

const SC = {
  Contaienr: styled.div<{ width: string; height: string; radius: number }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    animation: ${animations.loading} 1.3s infinite ease-in-out;
    border-radius: ${({ radius }) => radius}px;
    margin-bottom: 0.5rem;
  `,
};
