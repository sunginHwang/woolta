import styled from '@emotion/styled';
import animations from 'apps/blog/style/animations';

type Props = {
  width?: string;
  height?: string;
};

function SkeletonBar({ width = '20rem', height = '3.2rem' }: Props) {
  return <SC.Contaienr width={width} height={height} />;
}

export default SkeletonBar;

const SC = {
  Contaienr: styled.div<{ width: string; height: string }>`
    width: ${({ width }) => width};
    height: ${({ height }) => height};
    animation: ${animations.loading} 1.3s infinite ease-in-out;
    border-radius: 0.3rem;
    margin-bottom: 0.5rem;
  `,
};
