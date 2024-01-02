import React from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import PageHeader from '@components/common/PageHeader';
import MainHeader from '@components/layout/PageTemplate/MainHeader';

import palette from '@style/palette';
import { white } from '../../../style';

const TOP_PADDING = {
  NORMAL: 5.5,
  TOP: 10.5
};

interface IProps {
  title?: string;
  isMain?: boolean;
  useSidePadding?: boolean;
  bgColor?: string;
  useHeader?: boolean;
  topPadding?: number;
  rightHeader?: React.ReactNode;
  useBackButton?: boolean;
  // 헤더 탭 필요시 작성
  tabs?: React.ReactNode;
  children?: React.ReactNode;
  onBackClick?: () => void;
}

/**
 * 페이지 구성 템플릿
 * @component
 */

function PageTemplate(props: IProps) {
  const {
    title = '',
    isMain = false,
    bgColor = palette.white,
    useSidePadding = true,
    useHeader = true,
    useBackButton = true,
    topPadding = 0,
    onBackClick,
    rightHeader = null,
    tabs,
    children
  } = props;

  const history = useHistory();

  const onHeaderBackClick = () => {
    // 함수호출 없으면 뒤로가기 기본
    onBackClick ? onBackClick() : history.goBack();
  };
  // 기본 탑 padding 계산 (탭영역 유무)
  const defaultTopPadding = tabs ? TOP_PADDING.TOP : TOP_PADDING.NORMAL;
  const headerPadding = useHeader ? defaultTopPadding : 0;
  const topAreaPadding = topPadding > headerPadding ? topPadding : headerPadding;

  return (
    <>
      {isMain ? (
        <S.PageTemplate topPadding={defaultTopPadding}>
          <MainHeader />
          <S.Content useSidePadding>{children}</S.Content>
        </S.PageTemplate>
      ) : (
        <S.PageTemplate topPadding={topAreaPadding}>
          {useHeader && (
            <PageHeader
              title={title}
              tabs={tabs}
              useBackButton={useBackButton}
              right={rightHeader}
              onBackClick={onHeaderBackClick}
            />
          )}
          <S.Content useSidePadding={useSidePadding} bgColor={bgColor}>
            {children}
          </S.Content>
        </S.PageTemplate>
      )}
    </>
  );
}

export default PageTemplate;

type ContentType = {
  bgColor?: string;
  useSidePadding: boolean;
};
const S = {
  PageTemplate: styled.main<{ topPadding: number }>`
    width: 100%;
    padding-top: ${({ topPadding }) => `${topPadding}rem`}; // 헤더 사용 유무에 따른 상단 패딩 조정
  `,
  Content: styled.div<ContentType>`
    background-color: ${({ bgColor = white }) => bgColor};
    padding: 0 ${({ useSidePadding }) => (useSidePadding ? '2rem' : '0')};
  `
};
