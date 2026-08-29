'use client';

import { useWindowDimensions } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { typographyStyles } from '@wds/typography.stylex';
import Link from 'next/link';
import { HTMLAttributes, useEffect, useState } from 'react';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { className: _cls, style: _sty, ...restProps } = rest;

  return (
    <div
      data-cy='tabs'
      {...restProps}
      {...stylex.props(
        styles.tabs,
        stickeyHeight ? styles.tabsSticky : null,
        stickeyHeight ? dynamicStyles.stickyTop(stickeyHeight) : null,
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.link) {
          return (
            <Link replace href={tab?.link} key={tab.value} {...stylex.props(styles.link)}>
              <button
                type='button'
                data-cy={tab.label}
                onClick={() => onTabClick(tab, index)}
                {...stylex.props(
                  typographyStyles.title5Medium,
                  styles.tab,
                  tab.value === value ? styles.tabActive : null,
                )}
              >
                {tab.label}
              </button>
            </Link>
          );
        }
        return (
          <button
            key={tab.value}
            type='button'
            data-cy={tab.label}
            onClick={() => onTabClick(tab, index)}
            {...stylex.props(
              typographyStyles.title5Medium,
              styles.tab,
              tab.value === value ? styles.tabActive : null,
            )}
          >
            {tab.label}
          </button>
        );
      })}
      <span
        {...stylex.props(
          styles.bottomLine,
          dynamicStyles.indicatorWidth(indicatorWidth),
          dynamicStyles.indicatorLeft(indicatorLeftPosition),
        )}
      />
    </div>
  );
};

const dynamicStyles = stylex.create({
  stickyTop: (height: string) => ({ top: height }),
  indicatorWidth: (w: number) => ({ width: `${w}px` }),
  indicatorLeft: (l: number) => ({ left: `${l}px` }),
});

const styles = stylex.create({
  tabs: {
    width: '100%',
    height: '4.8rem',
    backgroundColor: colorVars['--color-white'],
    position: 'relative',
    display: 'flex',
  },
  tabsSticky: {
    position: 'sticky',
    zIndex: 10,
  },
  link: {
    width: '100%',
    cursor: 'pointer',
  },
  tab: {
    width: '100%',
    height: '100%',
    borderBottomWidth: '0.2rem',
    borderBottomStyle: 'solid',
    borderBottomColor: colorVars['--color-gray300'],
    color: colorVars['--color-grayInactive'],
  },
  tabActive: {
    color: colorVars['--color-orangePrimary'],
    borderBottomWidth: 0,
    borderBottomStyle: 'none',
    borderBottomColor: 'transparent',
  },
  bottomLine: {
    bottom: '-0.1rem',
    height: '0.2rem',
    position: 'absolute',
    transitionProperty: 'all',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: colorVars['--color-orangePrimary'],
  },
});
