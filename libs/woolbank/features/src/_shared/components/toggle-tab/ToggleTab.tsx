'use client';

import { useWindowDimensions } from '@common';
import { useEffect, useState } from 'react';
import { styled } from 'styled-components';

export interface ToggleTabItem {
  type: string;
  name: string;
}

interface Props {
  tabs: ToggleTabItem[];
  value: string;
  useOutline?: boolean;
  useListType?: boolean;
  size?: 'small' | 'medium';
  onChangeTab?: (tab: ToggleTabItem) => void;
}

/**
 * 토글 탭
 * @component
 */
export const ToggleTab = ({ tabs, value, useOutline = true, useListType = false, size = 'medium', onChangeTab }: Props) => {
  const { width } = useWindowDimensions();
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
      renderTabs =
        useOutline &&
        tabs.map((tab) => {
          return (
            <S.TabOutLine key={tab.type} $isActive={tab.type === value} onClick={() => onChangeTab && onChangeTab(tab)}>
              {tab.name}
            </S.TabOutLine>
          );
        });
    } else {
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
    <S.ToggleTab $useOutline={useOutline} $useListType={useListType} $size={size}>
      {renderTabs}
      {!useListType && !useOutline && <S.BottomLine width={indicatorWidth} left={indicatorLeftPosition} />}
    </S.ToggleTab>
  );
};

type ToggleTabSProps = {
  $useOutline: boolean;
  $useListType: boolean;
  $size: 'small' | 'medium';
};

type BottomLineProps = { width: number; left: number };

const S = {
  ToggleTab: styled.div<ToggleTabSProps>`
    width: 100%;
    position: relative;
    height: ${({ $useOutline, $size }) => ($useOutline ? ($size === 'small' ? 3 : 4) : $size === 'small' ? 4 : 5)}rem;
    display: flex;
    justify-content: ${({ $useListType }) => ($useListType ? 'flex-start' : 'space-around')};
    ${({ $useListType, $useOutline }) =>
      !$useListType &&
      !$useOutline &&
      'box-shadow: 0 0.2rem 0.4rem -0.1rem rgba(0, 0, 0, 0.2), 0 0.4rem 0.5rem 0 rgba(0, 0, 0, 0.14),\n      0 0.1rem 1rem 0 rgba(0, 0, 0, 0.12);'};

    button {
      font-size: ${({ $size }) => ($size === 'small' ? '1.1rem' : '1.3rem')};
    }
  `,
  Tab: styled.button<{ $isActive: boolean }>`
    width: 100%;
    font-weight: bold;
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.textActive : theme.colors.textInactive)};
  `,
  ListTab: styled.button<{ $isActive: boolean }>`
    margin-right: 2.5rem;
    font-weight: 800;
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.textPrimary : theme.colors.textTertiary)};
  `,
  TabOutLine: styled.button<{ $isActive: boolean }>`
    width: 100%;
    border: 0.1rem solid ${({ $isActive, theme }) => ($isActive ? theme.colors.orangePrimary : theme.colors.borderDefault)};
    background-color: ${({ $isActive, theme }) => ($isActive ? theme.colors.orangePrimary : theme.colors.white)};
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.textInverse : theme.colors.textTertiary)};

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