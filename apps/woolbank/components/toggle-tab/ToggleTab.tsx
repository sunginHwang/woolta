import { useWindowDimensions } from '@common';
import * as stylex from '@stylexjs/stylex';
import { colorVars } from '@wds/tokens.stylex';
import { useEffect, useState } from 'react';

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
  size?: 'small' | 'medium';
  // 탭 변경 이벤트
  onChangeTab?: (tab: ToggleTabItem) => void;
}

const getHeightStyle = (useOutline: boolean, size: 'small' | 'medium') => {
  if (useOutline && size === 'small') return styles.heightOutlineSmall;
  if (useOutline) return styles.heightOutlineMedium;
  if (size === 'small') return styles.heightNoOutlineSmall;
  return styles.heightNoOutlineMedium;
};

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
        <button
          type='button'
          key={tab.type}
          onClick={() => onChangeTab && onChangeTab(tab)}
          {...stylex.props(
            styles.listTab,
            tab.type === value && styles.listTabActive,
            size === 'small' ? styles.buttonSmall : styles.buttonMedium,
          )}
        >
          {tab.name}
        </button>
      );
    });
  } else {
    if (useOutline) {
      // 아웃라인 탭 구조
      renderTabs = tabs.map((tab, index) => {
        return (
          <button
            type='button'
            key={tab.type}
            onClick={() => onChangeTab && onChangeTab(tab)}
            {...stylex.props(
              styles.tabOutline,
              tab.type === value && styles.tabOutlineActive,
              index === 0 && styles.tabOutlineFirst,
              index === tabs.length - 1 && styles.tabOutlineLast,
              size === 'small' ? styles.buttonSmall : styles.buttonMedium,
            )}
          >
            {tab.name}
          </button>
        );
      });
    } else {
      // 라인 없는 탭 구조
      renderTabs = tabs.map((tab, index) => {
        return (
          <button
            type='button'
            key={tab.type}
            onClick={() => onTabClick(tab, index)}
            {...stylex.props(
              styles.tab,
              tab.type === value && styles.tabActive,
              size === 'small' ? styles.buttonSmall : styles.buttonMedium,
            )}
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
        styles.toggleTab,
        getHeightStyle(useOutline, size),
        useListType ? styles.justifyStart : styles.justifyAround,
        !useListType && !useOutline ? styles.withShadow : null,
      )}
    >
      {renderTabs}
      {!useListType && !useOutline && (
        <span
          {...stylex.props(
            styles.bottomLine,
            dynamicStyles.bottomLineWidth(indicatorWidth),
            dynamicStyles.bottomLineLeft(indicatorLeftPosition),
          )}
        />
      )}
    </div>
  );
};

const dynamicStyles = stylex.create({
  bottomLineWidth: (w: number) => ({ width: `${w}px` }),
  bottomLineLeft: (l: number) => ({ left: `${l}px` }),
});

const styles = stylex.create({
  toggleTab: {
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  // height variants
  heightOutlineSmall: { height: '3rem' },
  heightOutlineMedium: { height: '4rem' },
  heightNoOutlineSmall: { height: '4rem' },
  heightNoOutlineMedium: { height: '5rem' },
  // justify-content
  justifyStart: { justifyContent: 'flex-start' },
  justifyAround: { justifyContent: 'space-around' },
  // shadow
  withShadow: {
    boxShadow:
      '0 0.2rem 0.4rem -0.1rem rgba(0, 0, 0, 0.2), 0 0.4rem 0.5rem 0 rgba(0, 0, 0, 0.14), 0 0.1rem 1rem 0 rgba(0, 0, 0, 0.12)',
  },
  // button font sizes
  buttonSmall: { fontSize: '1.1rem' },
  buttonMedium: { fontSize: '1.3rem' },
  // tab variants
  tab: {
    width: '100%',
    fontWeight: 'bold',
    color: colorVars['--color-gray150'],
  },
  tabActive: {
    color: colorVars['--color-grayPrimary'],
  },
  listTab: {
    marginRight: '2.5rem',
    fontWeight: 800,
    color: colorVars['--color-gray600'],
  },
  listTabActive: {
    color: colorVars['--color-gray800'],
  },
  tabOutline: {
    width: '100%',
    borderWidth: '0.1rem',
    borderStyle: 'solid',
    borderColor: colorVars['--color-gray300'],
    backgroundColor: colorVars['--color-white'],
    color: colorVars['--color-gray600'],
  },
  tabOutlineActive: {
    borderColor: colorVars['--color-orangePrimary'],
    backgroundColor: colorVars['--color-orangePrimary'],
    color: colorVars['--color-white'],
  },
  tabOutlineFirst: {
    borderBottomLeftRadius: '1.3rem',
    borderTopLeftRadius: '1.3rem',
  },
  tabOutlineLast: {
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
