'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ElementType, KeyboardEvent } from 'react';
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export interface TabItem {
  /** 선택값. `value` prop 과 비교한다 */
  value: string;
  /** 탭 라벨. 한글 5자 안팎으로 짧게 */
  label: string;
  /** 비활성 — 키보드 이동에서도 건너뛴다 */
  disabled?: boolean;
  /** 새 콘텐츠가 있음을 알리는 점. 한 번에 한 탭에만 쓴다 */
  badge?: boolean;
  /** 있으면 `<button>` 대신 `linkComponent` 로 렌더링한다 (라우팅 탭) */
  href?: string;
}

export type TabsVariant = 'line' | 'chip';
export type TabsLayout = 'fill' | 'hug';
export type TabsChipStyle = 'solid' | 'outline';
export type TabsSize = 'medium' | 'small';

export interface TabsProps {
  /** 탭 목록 */
  items: TabItem[];
  /** 현재 선택된 탭의 value */
  value: string;
  /** 선택이 바뀔 때. 클릭·키보드 모두 이 콜백 하나로 온다 */
  onChange?: (value: string) => void;
  /**
   * line: 밑줄 인디케이터. 화면·섹션의 1차 전환
   * chip: 알약 모양. 2차 전환이나 좁은 영역
   * @default 'line'
   */
  variant?: TabsVariant;
  /**
   * line 전용. fill 은 탭을 균등 분할(5개 이하), hug 는 라벨 길이대로 두고 가로 스크롤(6개 이상·긴 라벨)
   * @default 'fill'
   */
  layout?: TabsLayout;
  /**
   * chip 전용. solid 는 화면 전체 전환, outline 은 일부 콘텐츠 전환
   * @default 'solid'
   */
  chipStyle?: TabsChipStyle;
  /**
   * line: medium 44px / small 40px · chip: medium 40px / small 36px
   * @default 'medium'
   */
  size?: TabsSize;
  /**
   * `href` 가 있는 탭을 그릴 컴포넌트. Next 의 Link 를 넘기면 라우팅 탭이 된다
   * @default 'a'
   */
  linkComponent?: ElementType;
  /** 스크롤해도 상단에 붙인다 */
  sticky?: boolean;
  /**
   * sticky 일 때 붙는 위치 (헤더 높이 등)
   * @default '0'
   */
  stickyTop?: string;
  /** tablist 의 접근성 이름 */
  'aria-label'?: string;
  /**
   * 탭 id 의 접두어. 패널 쪽에서 `aria-labelledby={getTabId(id, value)}` 로 연결한다.
   * 생략하면 useId 로 만든다
   */
  id?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

/** 탭 요소의 id. 패널의 `aria-labelledby` 에 쓴다 */
export const getTabId = (baseId: string, value: string) => `${baseId}-tab-${value}`;

/** 패널 요소의 id. 탭의 `aria-controls` 가 가리킨다 */
export const getTabPanelId = (baseId: string, value: string) => `${baseId}-panel-${value}`;

const styles = stylex.create({
  root: {
    position: 'relative',
    width: '100%',
    backgroundColor: colorVars['--color-bgSurface'],
  },
  sticky: {
    position: 'sticky',
    zIndex: 10,
  },
  // line 의 1px 하단 경계선. 인디케이터가 그 위에 겹친다
  lineRoot: {
    boxShadow: `inset 0 -1px 0 ${colorVars['--color-borderSubtle']}`,
  },
  list: {
    display: 'flex',
    alignItems: 'stretch',
    margin: 0,
    padding: 0,
    listStyle: 'none',
    position: 'relative',
  },
  listHug: {
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
    paddingInline: '1.6rem',
    scrollPaddingInline: '1.6rem',
  },
  listChip: {
    gap: '0.8rem',
    paddingInline: '1.6rem',
    paddingBlock: '0.8rem',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': { display: 'none' },
  },
  tab: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    position: 'relative',
    flexShrink: 0,
    margin: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    scrollMarginInline: '1.6rem',
    color: colorVars['--color-textSecondary'],
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  tabFill: {
    flex: 1,
    minWidth: 0,
  },
  tabSelected: {
    color: colorVars['--color-textPrimary'],
  },
  tabDisabled: {
    color: colorVars['--color-textDisabled'],
    pointerEvents: 'none',
  },
  tabLineMedium: {
    minHeight: '4.4rem',
    paddingInline: '1.6rem',
  },
  tabLineSmall: {
    minHeight: '4rem',
    paddingInline: '1.2rem',
  },
  // chip
  tabChip: {
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'transparent',
  },
  tabChipMedium: {
    height: '4rem',
    paddingInline: '1.6rem',
  },
  tabChipSmall: {
    height: '3.6rem',
    paddingInline: '1.4rem',
  },
  chipSolid: {
    backgroundColor: colorVars['--color-bgSurfaceSecondary'],
    color: colorVars['--color-textSecondary'],
  },
  chipSolidSelected: {
    backgroundColor: colorVars['--color-bgInverse'],
    color: colorVars['--color-textInverse'],
  },
  chipOutline: {
    backgroundColor: colorVars['--color-bgSurface'],
    borderColor: colorVars['--color-borderSubtle'],
    color: colorVars['--color-textSecondary'],
  },
  chipOutlineSelected: {
    borderColor: colorVars['--color-borderStrong'],
    color: colorVars['--color-textPrimary'],
  },
  chipDisabled: {
    opacity: 0.5,
  },
  badge: {
    width: '0.6rem',
    height: '0.6rem',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-statusInfo'],
    flexShrink: 0,
  },
  indicator: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: '0.2rem',
    backgroundColor: colorVars['--color-textPrimary'],
    transitionProperty: 'transform, width',
    transitionDuration: '250ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none',
  },
  indicatorHidden: {
    opacity: 0,
  },
});

const dynamicStyles = stylex.create({
  stickyTop: (top: string) => ({ top }),
  indicator: (x: number, width: number) => ({
    transform: `translateX(${x}px)`,
    width: `${width}px`,
  }),
});

const SIZE_TEXT = {
  medium: typographyStyles.title6Bold,
  small: typographyStyles.body4Bold,
} as const satisfies Record<TabsSize, unknown>;

/**
 * 탭 — 한 화면 안에서 콘텐츠를 나눠 전환한다.
 * woolbank 의 Tabs(밑줄)·ToggleTab(리스트/언더라인)·AccountBookTabs 를 당근 SEED 의 line/chip 체계로 합친 것이다.
 *
 * - 1차 전환은 `line`, 그 아래 2차 전환은 `chip`. 두 단계를 같은 모양으로 겹쳐 쓰지 않는다.
 * - 탭이 6개 이상이거나 라벨이 길면 `layout='hug'` 로 가로 스크롤한다.
 * - 키보드: ←/→ 로 이동(비활성 건너뜀), Home/End 로 양 끝. 선택된 탭만 Tab 키 순서에 들어간다.
 * - 패널과는 `getTabId`/`getTabPanelId` 로 `aria-controls`·`aria-labelledby` 를 연결한다.
 * @component
 */
export const Tabs = ({
  items,
  value,
  onChange,
  variant = 'line',
  layout = 'fill',
  chipStyle = 'solid',
  size = 'medium',
  linkComponent: LinkComponent = 'a',
  sticky = false,
  stickyTop = '0',
  'aria-label': ariaLabel,
  id: idProp,
  xstyle,
}: TabsProps) => {
  const generatedId = useId();
  const baseId = idProp ?? generatedId;
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLElement | null>>({});
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);

  const isLine = variant === 'line';
  const isHug = isLine && layout === 'hug';

  // 선택된 탭의 실제 위치를 재서 인디케이터를 옮긴다 (창 폭 계산 대신 ref 측정)
  const measure = useCallback(() => {
    const tab = tabRefs.current[value];
    if (!tab) {
      setIndicator(null);
      return;
    }
    setIndicator({ x: tab.offsetLeft, width: tab.offsetWidth });
  }, [value]);

  useLayoutEffect(() => {
    if (!isLine) return;
    measure();
  }, [isLine, measure]);

  useEffect(() => {
    if (!isLine || !listRef.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(listRef.current);
    return () => observer.disconnect();
  }, [isLine, measure]);

  // hug 는 선택된 탭이 가려지지 않게 스크롤한다
  useEffect(() => {
    if (!isHug && variant !== 'chip') return;
    tabRefs.current[value]?.scrollIntoView?.({ inline: 'nearest', block: 'nearest' });
  }, [isHug, variant, value]);

  const select = (next: string, focus = false) => {
    if (next !== value) onChange?.(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const enabled = items.filter((item) => !item.disabled);
    if (enabled.length === 0) return;
    const current = enabled.findIndex((item) => item.value === value);
    let next: TabItem | undefined;

    switch (event.key) {
      case 'ArrowRight':
        next = enabled[(current + 1) % enabled.length];
        break;
      case 'ArrowLeft':
        next = enabled[(current - 1 + enabled.length) % enabled.length];
        break;
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled[enabled.length - 1];
        break;
      default:
        return;
    }

    event.preventDefault();
    if (next) select(next.value, true);
  };

  const sizeStyle = isLine
    ? size === 'medium'
      ? styles.tabLineMedium
      : styles.tabLineSmall
    : size === 'medium'
      ? styles.tabChipMedium
      : styles.tabChipSmall;

  return (
    <div
      {...stylex.props(
        styles.root,
        isLine && styles.lineRoot,
        sticky && styles.sticky,
        sticky && dynamicStyles.stickyTop(stickyTop),
        xstyle,
      )}
    >
      <div
        ref={listRef}
        role='tablist'
        aria-label={ariaLabel}
        aria-orientation='horizontal'
        onKeyDown={onKeyDown}
        {...stylex.props(styles.list, isHug && styles.listHug, !isLine && styles.listChip)}
      >
        {items.map((item) => {
          const selected = item.value === value;
          const disabled = item.disabled === true;
          const Tag: ElementType = item.href ? LinkComponent : 'button';

          const sx = stylex.props(
            SIZE_TEXT[size],
            styles.tab,
            sizeStyle,
            isLine && layout === 'fill' && styles.tabFill,
            isLine && selected && styles.tabSelected,
            isLine && disabled && styles.tabDisabled,
            !isLine && styles.tabChip,
            !isLine && (chipStyle === 'solid' ? styles.chipSolid : styles.chipOutline),
            !isLine && selected && (chipStyle === 'solid' ? styles.chipSolidSelected : styles.chipOutlineSelected),
            !isLine && disabled && styles.chipDisabled,
            !isLine && disabled && styles.tabDisabled,
          );

          return (
            <Tag
              key={item.value}
              ref={(node: HTMLElement | null) => {
                tabRefs.current[item.value] = node;
              }}
              id={getTabId(baseId, item.value)}
              role='tab'
              aria-selected={selected}
              aria-controls={getTabPanelId(baseId, item.value)}
              aria-disabled={disabled || undefined}
              tabIndex={selected ? 0 : -1}
              {...(item.href ? { href: item.href } : { type: 'button', disabled })}
              onClick={() => {
                if (!disabled) select(item.value);
              }}
              data-value={item.value}
              {...sx}
            >
              {item.label}
              {item.badge && <span role='img' aria-label='새 소식' {...stylex.props(styles.badge)} />}
            </Tag>
          );
        })}
        {isLine && (
          <span
            aria-hidden='true'
            data-testid='tabs-indicator'
            {...stylex.props(
              styles.indicator,
              indicator ? dynamicStyles.indicator(indicator.x, indicator.width) : styles.indicatorHidden,
            )}
          />
        )}
      </div>
    </div>
  );
};
