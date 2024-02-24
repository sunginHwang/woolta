import { Text } from '@wds';
import { useRouter } from 'next/navigation';
import React, { FC, useCallback } from 'react';
import { styled, useTheme } from 'styled-components';
import { layout } from '../../../style/layout';
import { IconChevronLeft } from '../../atom/Icon';

interface Props {
  // 헤더 타이틀
  title: string;
  // 아이콘 색상
  iconColor?: string;
  // 뒤로가기 버튼 사용 우무
  useBackButton?: boolean;
  // 뒤로가기 클릭 이벤트
  onBackClick?: () => void;
  // 우측 영역 dom 추가
  right?: React.ReactNode | string;
  // skeleton 모드 사용 유무
  useSkeleton?: boolean;
}

/**
 * 페이지 서브 헤더
 * @component
 */
const SubHeader: FC<Props> = ({ title, iconColor, useSkeleton = false, useBackButton = true, onBackClick, right }) => {
  const { colors } = useTheme();
  const { back } = useRouter();

  const handleBackClick = useCallback(() => {
    back();
    onBackClick?.();
  }, [back, onBackClick]);

  return (
    <SC.HeaderWithBack useSkeleton={useSkeleton}>
      {useBackButton && (
        <div className='side' onClick={handleBackClick}>
          <IconChevronLeft width={26} height={26} fill={iconColor ?? colors.pinkPrimary} />
        </div>
      )}
      <Text variant='title4Bold' color='black' data-cy='title' as='p'>
        {title}
      </Text>
      <div className='side'>{right}</div>
    </SC.HeaderWithBack>
  );
};

const SC = {
  HeaderWithBack: styled.header<{ useSkeleton?: boolean }>`
    position: sticky;
    left: 0;
    top: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header};
    background-color: ${({ useSkeleton, theme }) => (useSkeleton ? 'transparent' : theme.colors.white)};
    border-bottom: ${({ useSkeleton }) => (useSkeleton ? 'none' : '0.1rem solid #dcdce9')};
    height: ${layout.headerHeight};
    display: flex;
    align-items: center;
    padding: 0 1.6rem;

    .side {
      width: 100%;
      flex: 1 1 0%;
      display: flex;
      align-items: center;
    }

    .title {
      width: 100%;
      flex: 2 1 0%;
    }
  `,
};

export default SubHeader;
