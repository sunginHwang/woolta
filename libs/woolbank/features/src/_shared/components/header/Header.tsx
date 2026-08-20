'use client';

import { Text } from '@wds';
import { PropsWithChildren, ReactNode } from 'react';
import { styled, useTheme } from 'styled-components';
import { layout } from '../../style/layout';
import SubHeader from './SubHeader';

interface Props extends PropsWithChildren {
  title: string | ReactNode;
  iconColor?: string;
  useBackButton?: boolean;
  onBackClick?: () => void;
  right?: React.ReactNode | string;
  bgColor?: string;
}

/**
 * 페이지 헤더 영역
 * @component
 */
const _Header = ({ title, right, bgColor }: Props) => {
  const { colors } = useTheme();
  const isTextTitle = typeof title === 'string';
  const backgroundColor = bgColor ?? colors.white;

  return (
    <SC.Container $bgColor={backgroundColor}>
      <div className='inner'>
        {isTextTitle && (
          <Text variant='title4Bold' color='grayPrimary' data-cy='title'>
            {title}
          </Text>
        )}
        {!isTextTitle && title}
        <SC.RightHeader>{right}</SC.RightHeader>
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.header<{ $bgColor: string }>`
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header};

    .inner {
      height: ${layout.headerHeight};
      padding: 0 1.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: ${({ $bgColor }) => $bgColor};
    }
  `,
  RightHeader: styled.div`
    padding-top: 0.4rem;
    color: ${({ theme }) => theme.colors.graySecondary};
  `,
};

export const Header = Object.assign(_Header, {
  Sub: SubHeader,
});