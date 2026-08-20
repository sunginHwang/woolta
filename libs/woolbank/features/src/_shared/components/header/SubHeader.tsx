'use client';

import { Text } from '@wds';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback } from 'react';
import { styled, useTheme } from 'styled-components';
import { IconChevronLeft } from '../../icons';
import { layout } from '../../style/layout';

interface Props {
  title: string;
  iconColor?: string;
  useBackButton?: boolean;
  onBackClick?: () => void;
  right?: React.ReactNode | string;
  useSkeleton?: boolean;
  position?: 'sticky' | 'fixed';
}

/**
 * 페이지 서브 헤더
 * @component
 */
const SubHeader: FC<Props> = ({
  title,
  iconColor,
  position = 'sticky',
  useSkeleton = false,
  useBackButton = true,
  onBackClick,
  right,
}) => {
  const { colors } = useTheme();
  const { back } = useRouter();

  const handleBackClick = useCallback(() => {
    back();
    onBackClick?.();
  }, [back, onBackClick]);

  return (
    <SC.HeaderWithBack $position={position} $useSkeleton={useSkeleton}>
      <div className='inner'>
        {useBackButton && (
          <div className='side' onClick={handleBackClick}>
            <IconChevronLeft width={26} height={26} fill={iconColor ?? colors.pinkPrimary} />
          </div>
        )}
        <Text variant='title4Bold' className='title' color='black' data-cy='title' as='p' alignment='center'>
          {title}
        </Text>
        <div className='side'>{right}</div>
      </div>
    </SC.HeaderWithBack>
  );
};

const SC = {
  HeaderWithBack: styled.header<{ $useSkeleton?: boolean; $position: string }>`
    position: ${({ $position }) => $position};
    left: 0;
    top: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header};

    .inner {
      padding: 0 1.6rem;
      background-color: ${({ $useSkeleton, theme }) => ($useSkeleton ? 'transparent' : theme.colors.white)};
      border-bottom: ${({ $useSkeleton }) => ($useSkeleton ? 'none' : '0.1rem solid #dcdce9')};
      height: ${layout.headerHeight};
      display: flex;
      align-items: center;
    }

    .side {
      width: 100%;
      flex: 1 1 0%;
      display: flex;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
        text-align: left;
      }

      &:last-child {
        justify-content: flex-end;
        text-align: right;
      }
    }

    .title {
      width: 100%;
      flex: 2 1 0%;
    }
  `,
};

export default SubHeader;