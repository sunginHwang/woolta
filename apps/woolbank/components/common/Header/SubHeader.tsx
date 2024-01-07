import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import React, { FC, useCallback } from 'react';
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
  // 헤더 탭 필요시 작성
  tabs?: React.ReactNode;
}

/**
 * 페이지 헤더 영역
 * @component
 */
const SubHeader: FC<Props> = ({
  title,
  iconColor,
  useSkeleton = false,
  useBackButton = true,
  onBackClick,
  right,
  tabs,
}) => {
  const { colors } = useTheme();

  // 뒤로 버튼 클릭 이벤트
  const onBackButtonClick = useCallback(() => {
    useBackButton && onBackClick && onBackClick();
  }, [useBackButton, onBackClick]);

  const useBigTitleMode = !useBackButton && title.length > 0 && !right;
  const useTabs = !!tabs;

  return (
    <SC.HeaderWithBack useTabs={useTabs} useSkeleton={useSkeleton} useBigTitle={useBigTitleMode}>
      <div>
        {useBackButton && (
          <div onClick={onBackButtonClick}>
            <IconChevronLeft width={26} height={26} fill={iconColor ?? colors.pinkPrimary} />
          </div>
        )}
        <p data-cy='title'>{title}</p>
        <SC.rightHeader>{right}</SC.rightHeader>
      </div>
      {tabs}
    </SC.HeaderWithBack>
  );
};

type HeaderWithBackProps = {
  useTabs: boolean;
  useSkeleton: boolean;
  useBigTitle: boolean;
};
const SC = {
  HeaderWithBack: styled.div<HeaderWithBackProps>`
    height: ${({ useTabs }) => (useTabs ? '9.8rem' : '4.8rem')};
    display: flex;
    flex-direction: ${({ useTabs }) => (useTabs ? 'column' : 'row')};
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header};
    background-color: ${({ useSkeleton, theme }) => (useSkeleton ? 'transparent' : theme.colors.white)};
    border-bottom: ${({ useSkeleton, useBigTitle }) => (useSkeleton || useBigTitle ? 'none' : '0.1rem solid #dcdce9')};

    > div {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;

      &:first-child {
        margin-left: 2rem;
      }
      &:last-child {
        margin-right: ${({ useTabs }) => (useTabs ? 0 : 2)}rem;
      }

      > div {
        flex: 1;
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

      > p {
        flex: 2;
        text-align: ${({ useBigTitle }) => (useBigTitle ? 'left' : 'center')};
        font-size: ${({ useBigTitle }) => (useBigTitle ? 1.8 : 1.4)}rem;
        font-weight: 800;
        white-space: nowrap;
        color: ${({ theme }) => theme.colors.grayPrimary};
      }
    }
  `,
  rightHeader: styled.div`
    padding-top: 0.4rem;
    color: ${({ theme }) => theme.colors.graySecondary};
  `,
};

export default SubHeader;
