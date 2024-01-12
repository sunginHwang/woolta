import styled from '@emotion/styled';
import { Text } from '@wds';
import React, { FC, PropsWithChildren } from 'react';
import { layout } from '../../../style/layout';
import SubHeader from './SubHeader';

interface Props extends PropsWithChildren {
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
 * 페이지 헤더 영역
 * @component
 */
const Header: FC<Props> = ({ title, right }) => {
  return (
    <SC.Container>
      <div className='inner'>
        <Text variant='title4Bold' color='grayPrimary' data-cy='title'>
          {title}
        </Text>
        <SC.rightHeader>{right}</SC.rightHeader>
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.header`
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
      background-color: ${({ theme }) => theme.colors.white};
    }
  `,
  rightHeader: styled.div`
    padding-top: 0.4rem;
    color: ${({ theme }) => theme.colors.graySecondary};
  `,
};

export default Object.assign(Header, {
  Sub: SubHeader,
});
