'use client';

import { useWindowDimensions } from '@common';
import { typography } from '@wds';
import Link from 'next/link';
import { HTMLAttributes, useEffect, useState } from 'react';
import { styled, css } from 'styled-components';

export interface Tab {
  label: string;
  value?: string;
  link?: string;
}
interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'value' | 'onChange'> {
  tabs: Tab[];
  value: string;
  stickeyHeight?: string;
  onChange?: (tab: Tab) => void;
}

/**
 * 공통 -  탭
 * @component
 */
export const Tabs = ({ tabs, value, stickeyHeight, onChange, ...rest }: Props) => {
  const { width } = useWindowDimensions();

  // 인디케이터 길이
  const indicatorWidth = width / tabs.length;
  const activeTabIndex = tabs.findIndex((tab) => tab.value === value);

  const [indicatorLeftPosition, setIndicatorLeftPosition] = useState(indicatorWidth * activeTabIndex);

  useEffect(() => {
    setIndicatorLeftPosition(indicatorWidth * activeTabIndex);
  }, [value, indicatorWidth, activeTabIndex]);

  const onTabClick = (tab: Tab, index: number) => {
    setIndicatorLeftPosition(indicatorWidth * index);
    onChange && onChange(tab);
  };

  return (
    <SC.Tabs data-cy='tabs' $stickeyheight={stickeyHeight} {...rest}>
      {tabs.map((tab, index) => {
        if (tab.link) {
          return (
            <Link replace href={tab?.link} key={tab.value}>
              <SC.Tab $isActive={tab.value === value} data-cy={tab.label} onClick={() => onTabClick(tab, index)}>
                {tab.label}
              </SC.Tab>
            </Link>
          );
        }
        return (
          <SC.Tab
            key={tab.value}
            $isActive={tab.value === value}
            data-cy={tab.label}
            onClick={() => onTabClick(tab, index)}
          >
            {tab.label}
          </SC.Tab>
        );
      })}
      <SC.BottomLine $width={indicatorWidth} $left={indicatorLeftPosition} />
    </SC.Tabs>
  );
};

const SC = {
  Tabs: styled.div<{ $stickeyheight?: string }>`
    width: 100%;
    height: 4.8rem;
    background-color: ${({ theme }) => theme.colors.white};
    position: relative;
    display: flex;
    ${({ $stickeyheight }) =>
      $stickeyheight &&
      css`
        position: sticky;
        top: ${$stickeyheight};
        z-index: 10;
      `}

    a {
      width: 100%;
      cursor: pointer;
    }
  `,
  Tab: styled.button<{ $isActive: boolean }>`
    ${typography.title5Medium}
    width: 100%;
    height: 100%;
    border-bottom: ${({ $isActive, theme }) => ($isActive ? '' : `.2rem solid ${theme.colors.gray300}`)};
    color: ${({ $isActive, theme }) => ($isActive ? theme.colors.orangePrimary : theme.colors.grayInactive)};
  `,
  BottomLine: styled.span<{
    $width: number;
    $left: number;
  }>`
    bottom: -0.1rem;
    width: ${({ $width }) => $width}px;
    left: ${({ $left }) => $left}px;
    height: 0.2rem;
    position: absolute;
    transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    background-color: ${({ theme }) => theme.colors.orangePrimary};
  `,
};
