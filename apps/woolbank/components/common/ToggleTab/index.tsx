import { useWindowDimensions } from '@common';
import { FC, useEffect, useState } from 'react';
import { styled } from 'styled-components';

export interface ToggleTabItem {
  type: string;
  name: string;
}

interface Props {
  // 탭 리스트
  tabs: ToggleTabItem[];
  // 황성화 탭
  value: string;
  // 경계선 사용 유무
  useOutline?: boolean;
  // 리스트 타입 사용 유무
  useListType?: boolean;
  // 탭 변경 이벤트
  onChangeTab?: (tab: ToggleTabItem) => void;
}

/**
 * 토글 탭
 * @component
 */
const ToggleTab: FC<Props> = ({ tabs, value, useOutline = true, useListType = false, onChangeTab }) => {
  const { width } = useWindowDimensions();
  // 인디케이터 길이
  const indicatorWidth = width / tabs.length;
  const activeTabIndex = tabs.findIndex((tab) => tab.type === value);

  const [indicatorLeftPosition, setIndicatorLeftPosition] = useState(indicatorWidth * activeTabIndex);
  let renderTabs = null;

  useEffect(() => {
    setIndicatorLeftPosition(indicatorWidth * activeTabIndex);
  }, [value, indicatorWidth, activeTabIndex]);

  const onTabClick = (tab: ToggleTabItem, index: number) => {
    setIndicatorLeftPosition(indicatorWidth * index);
    onChangeTab && onChangeTab(tab);
  };

  // 리스트 타입 구조
  if (useListType) {
    renderTabs = tabs.map((tab) => {
      return (
        <S.ListTab key={tab.type} $isActive={tab.type === value} onClick={() => onChangeTab && onChangeTab(tab)}>
          {tab.name}
        </S.ListTab>
      );
    });
  } else {
    if (useOutline) {
      // 아웃라인 탭 구조

      renderTabs =
        useOutline &&
        tabs.map((tab, index) => {
          return (
            <S.TabOutLine key={tab.type} $isActive={tab.type === value} onClick={() => onChangeTab && onChangeTab(tab)}>
              {tab.name}
            </S.TabOutLine>
          );
        });
    } else {
      // 라인 없는 탭 구조
      renderTabs = tabs.map((tab, index) => {
        return (
          <S.Tab key={tab.type} $isActive={tab.type === value} onClick={() => onTabClick(tab, index)}>
            {tab.name}
          </S.Tab>
        );
      });
    }
  }

  return (
    <S.ToggleTab $useOutline={useOutline} $useListType={useListType}>
      {renderTabs}
      {!useListType && !useOutline && <S.BottomLine width={indicatorWidth} left={indicatorLeftPosition} />}
    </S.ToggleTab>
  );
};

type ToggleTabSProps = {
  $useOutline: boolean;
  $useListType: boolean;
};

type BottomLineProps = { width: number; left: number };

const S = {
  ToggleTab: styled.div<ToggleTabSProps>`
    width: 100%;
    position: relative;
    height: ${({ $useOutline }) => ($useOutline ? '4' : '5')}rem;
    display: flex;
    justify-content: ${({ $useListType }) => ($useListType ? 'flex-start' : 'space-around')};
    margin-bottom: 1rem;
    ${({ $useListType, $useOutline }) =>
      !$useListType &&
      !$useOutline &&
      'box-shadow: 0 0.2rem 0.4rem -0.1rem rgba(0, 0, 0, 0.2), 0 0.4rem 0.5rem 0 rgba(0, 0, 0, 0.14),\n      0 0.1rem 1rem 0 rgba(0, 0, 0, 0.12);'};

    button {
      font-size: 1.3rem;
    }
  `,
  Tab: styled.button<{ active: boolean }>`
    width: 100%;
    font-weight: bold;
    color: ${({ active, theme }) => (active ? theme.colors.grayPrimary : theme.colors.gray150)};
  `,
  ListTab: styled.button<{ active: boolean }>`
    margin-right: 2.5rem;
    font-weight: 800;
    color: ${({ active, theme }) => (active ? theme.colors.gray800 : theme.colors.gray600)};
  `,
  TabOutLine: styled.button<{ $isActive: boolean }>`
    width: 100%;
    border: 0.1rem solid ${({ $isActive, theme }) => ($isActive ? theme.colors.orangePrimary : theme.colors.gray300)};
    background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.orangePrimary : theme.colors.white)};
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : theme.colors.gray600)};

    &:first-child {
      border-bottom-left-radius: 1.3rem;
      border-top-left-radius: 1.3rem;
    }

    &:last-child {
      border-bottom-right-radius: 1.3rem;
      border-top-right-radius: 1.3rem;
    }
  `,
  BottomLine: styled.span<BottomLineProps>`
    bottom: 0;
    width: ${({ width }) => width}px;
    left: ${({ left }) => left}px;
    height: 2px;
    position: absolute;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background-color: ${({ theme }) => theme.colors.orangePrimary};
  `,
};

export default ToggleTab;
