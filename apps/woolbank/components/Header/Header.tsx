import { Text, white } from '@wds';
import { PropsWithChildren, ReactNode } from 'react';
import { styled } from 'styled-components';
import { layout } from '../../style/layout';
import SubHeader from './SubHeader';

interface Props extends PropsWithChildren {
  // 헤더 타이틀
  title: string | ReactNode;
  // 아이콘 색상
  iconColor?: string;
  // 뒤로가기 버튼 사용 우무
  useBackButton?: boolean;
  // 뒤로가기 클릭 이벤트
  onBackClick?: () => void;
  // 우측 영역 dom 추가
  right?: React.ReactNode | string;
  bgColor?: string;
}

/**
 * 페이지 헤더 영역
 * @component
 */
const _Header = ({ title, right, bgColor = white }: Props) => {
  const isTextTitle = typeof title === 'string';
  return (
    <SC.Container color={bgColor}>
      <div className='inner'>
        {isTextTitle && (
          <Text variant='title4Bold' color='grayPrimary' data-cy='title'>
            {title}
          </Text>
        )}
        {!isTextTitle && title}
        <SC.rightHeader>{right}</SC.rightHeader>
      </div>
    </SC.Container>
  );
};

const SC = {
  Container: styled.header<{ color: string }>`
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
      background-color: ${({ color }) => color};
    }
  `,
  rightHeader: styled.div`
    padding-top: 0.4rem;
    color: ${({ theme }) => theme.colors.graySecondary};
  `,
};

export const Header = Object.assign(_Header, {
  Sub: SubHeader,
});
