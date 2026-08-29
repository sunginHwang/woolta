'use client';

import { useWindowDimensions } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useEffect, useState } from 'react';

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

const dynamicStyles = stylex.create({
  containerHeight: (useOutline: boolean, size: 'small' | 'medium') => ({
    height: `${useOutline ? (size === 'small' ? 3 : 4) : size === 'small' ? 4 : 5}rem`,
  }),
  buttonFontSize: (size: 'small' | 'medium') => ({
    fontSize: size === 'small' ? '1.1rem' : '1.3rem',
  }),
  tabActive: (isActive: boolean) => ({
    color: isActive ? colorVars['--color-textActive'] : colorVars['--color-textInactive'],
  }),
  listTabActive: (isActive: boolean) => ({
    color: isActive ? colorVars['--color-textPrimary'] : colorVars['--color-textTertiary'],
  }),
  tabOutLineActive: (isActive: boolean) => ({
    borderColor: isActive ? colorVars['--color-orangePrimary'] : colorVars['--color-borderDefault'],
    backgroundColor: isActive ? colorVars['--color-orangePrimary'] : colorVars['--color-white'],
    color: isActive ? colorVars['--color-textInverse'] : colorVars['--color-textTertiary'],
  }),
  bottomLinePos: (width: number, left: number) => ({
    width: `${width}px`,
    left: `${left}px`,
  }),
});

/**
 * 토글 탭
 * @component
 */
export const ToggleTab = ({
  tabs,
  value,
  useOutline = true,
  useListType = false,
  size = 'medium',
  onChangeTab,
}: Props) => {
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

  const showShadow = !useListType && !useOutline;

  if (useListType) {
    renderTabs = tabs.map((tab) => {
      return (
        <button
          key={tab.type}
          {...stylex.props(
            styles.listTab,
            dynamicStyles.listTabActive(tab.type === value),
            dynamicStyles.buttonFontSize(size),
          )}
          onClick={() => onChangeTab && onChangeTab(tab)}
        >
          {tab.name}
        </button>
      );
    });
  } else {
    if (useOutline) {
      renderTabs = tabs.map((tab, index) => {
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;
        return (
          <button
            key={tab.type}
            {...stylex.props(
              styles.tabOutLine,
              dynamicStyles.tabOutLineActive(tab.type === value),
              dynamicStyles.buttonFontSize(size),
              isFirst && styles.tabOutLineFirst,
              isLast && styles.tabOutLineLast,
            )}
            onClick={() => onChangeTab && onChangeTab(tab)}
          >
            {tab.name}
          </button>
        );
      });
    } else {
      renderTabs = tabs.map((tab, index) => {
        return (
          <button
            key={tab.type}
            {...stylex.props(
              styles.tab,
              dynamicStyles.tabActive(tab.type === value),
              dynamicStyles.buttonFontSize(size),
            )}
            onClick={() => onTabClick(tab, index)}
          >
            {tab.name}
          </button>
        );
      });
    }
  }

  return (
    <div
      {...stylex.props(
        styles.container,
        dynamicStyles.containerHeight(useOutline, size),
        useListType ? styles.containerJustifyStart : styles.containerJustifyAround,
        showShadow && styles.containerWithShadow,
      )}
    >
      {renderTabs}
      {!useListType && !useOutline && (
        <span
          {...stylex.props(styles.bottomLine, dynamicStyles.bottomLinePos(indicatorWidth, indicatorLeftPosition))}
        />
      )}
    </div>
  );
};

const styles = stylex.create({
  container: {
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  containerJustifyStart: {
    justifyContent: 'flex-start',
  },
  containerJustifyAround: {
    justifyContent: 'space-around',
  },
  containerWithShadow: {
    boxShadow:
      '0 0.2rem 0.4rem -0.1rem rgba(0, 0, 0, 0.2), 0 0.4rem 0.5rem 0 rgba(0, 0, 0, 0.14), 0 0.1rem 1rem 0 rgba(0, 0, 0, 0.12)',
  },
  tab: {
    width: '100%',
    fontWeight: 'bold',
  },
  listTab: {
    marginRight: '2.5rem',
    fontWeight: 800,
  },
  tabOutLine: {
    width: '100%',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
  },
  tabOutLineFirst: {
    borderBottomLeftRadius: '1.3rem',
    borderTopLeftRadius: '1.3rem',
  },
  tabOutLineLast: {
    borderBottomRightRadius: '1.3rem',
    borderTopRightRadius: '1.3rem',
  },
  bottomLine: {
    bottom: 0,
    height: '2px',
    position: 'absolute',
    transitionProperty: 'all',
    transitionDuration: '300ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: colorVars['--color-orangePrimary'],
  },
});
