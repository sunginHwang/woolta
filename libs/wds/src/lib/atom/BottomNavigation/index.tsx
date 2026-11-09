'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ElementType, ReactNode } from 'react';
import { Fragment } from 'react';
import { colorVars, shadowVars, zIndexConsts } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 하단 내비게이션 한 칸 */
export interface BottomNavigationItem {
  /** 선택 값. `value` prop 과 비교한다 */
  value: string;
  /** 라벨. 한글 5자 이내 권장 (SEED) */
  label: string;
  /** 기본(미선택) 아이콘. 24px */
  icon: ReactNode;
  /** 선택 시 아이콘. 없으면 `icon` 을 색만 바꿔 쓴다. Fill 스타일 권장 */
  selectedIcon?: ReactNode;
  /** 있으면 `linkComponent` 로 렌더링한다. 없으면 `<button>` */
  href?: string;
  /** 비활성 */
  disabled?: boolean;
  /** 알림 배지. `'dot'` 은 점, 숫자는 1~99 (100 이상은 "99+", 0 은 숨김) */
  badge?: number | 'dot';
}

/** 가운데 액션 버튼. 탭이 아니라 "바로 이동" 성격의 액션이다 (SEED 글쓰기 버튼, woolbank 가계부 추가) */
export interface BottomNavigationCenterAction {
  icon: ReactNode;
  /** 보이지 않는 이름. `aria-label` 로 들어간다 */
  label: string;
  onClick: () => void;
}

export interface BottomNavigationProps {
  /** 탭 목록. 최대 5개 — 넘치면 개발 모드 경고 후 앞 5개만 쓴다 */
  items: BottomNavigationItem[];
  /** 선택된 탭의 `value` */
  value: string;
  /** 탭 클릭 시 호출. `href` 가 있는 탭도 호출된다 (낙관적 활성 표시용) */
  onChange?: (value: string) => void;
  /**
   * `href` 가 있는 탭을 그릴 컴포넌트. Next 앱은 `Link` 를 넘긴다
   * @default 'a'
   */
  linkComponent?: ElementType;
  /** 탭 사이 가운데(floor(n/2)) 에 놓는 원형 강조 버튼 */
  centerAction?: BottomNavigationCenterAction;
  /**
   * `fixed` 는 화면 하단 고정, `static` 은 흐름 안 배치(스토리북·임베드)
   * @default 'fixed'
   */
  position?: 'fixed' | 'static';
  /**
   * true 면 아래로 밀어 숨긴다(스크롤 다운 시). 전환은 CSS transform
   * @default false
   */
  hidden?: boolean;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(nav)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

export const BOTTOM_NAVIGATION_MAX_ITEMS = 5;

const styles = stylex.create({
  nav: {
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    boxSizing: 'border-box',
    paddingBottom: 'env(safe-area-inset-bottom)',
    backgroundColor: colorVars['--color-bgSurface'],
    boxShadow: shadowVars['--shadow-nav'],
    borderTopLeftRadius: '2rem',
    borderTopRightRadius: '2rem',
    zIndex: zIndexConsts.navigationBar,
    transitionProperty: 'transform',
    transitionDuration: '0.25s',
    transitionTimingFunction: 'ease-in-out',
    transform: 'translateY(0)',
  },
  navFixed: { position: 'fixed' },
  navStatic: { position: 'relative' },
  navHidden: { transform: 'translateY(calc(100% + env(safe-area-inset-bottom)))' },
  list: {
    display: 'flex',
    alignItems: 'stretch',
    width: '100%',
    maxWidth: '48rem',
    minHeight: '5.8rem',
    marginInline: 'auto',
    marginBlock: 0,
    padding: 0,
    listStyle: 'none',
  },
  cell: {
    flexBasis: 0,
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
  },
  tab: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.4rem',
    paddingBlock: '0.6rem',
    paddingInline: '0.4rem',
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    textDecoration: 'none',
    color: colorVars['--color-textTertiary'],
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
    borderRadius: '0.8rem',
  },
  tabSelected: { color: colorVars['--color-textPrimary'] },
  labelSelected: { fontWeight: 600 },
  tabDisabled: { color: colorVars['--color-textDisabled'], cursor: 'not-allowed' },
  iconWrap: {
    position: 'relative',
    display: 'inline-flex',
    width: '2.4rem',
    height: '2.4rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    lineHeight: '1.3rem',
  },
  centerCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: '4.4rem',
    height: '4.4rem',
    borderRadius: '50%',
    borderWidth: 0,
    borderStyle: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorVars['--color-textInverse'],
    backgroundColor: {
      default: colorVars['--color-interactivePrimary'],
      ':hover': colorVars['--color-interactivePrimaryHover'],
    },
    boxShadow: shadowVars['--shadow-popover'],
    cursor: 'pointer',
    transform: {
      default: 'scale(1)',
      ':active': 'scale(0.92)',
    },
    transitionProperty: 'transform, background-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '0.2rem',
  },
  badgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '0.6rem',
    height: '0.6rem',
    borderRadius: '50%',
    backgroundColor: colorVars['--color-statusError'],
  },
  badgeCount: {
    position: 'absolute',
    top: '-0.4rem',
    left: '1.4rem',
    minWidth: '1.6rem',
    height: '1.6rem',
    paddingInline: '0.4rem',
    boxSizing: 'border-box',
    borderRadius: '0.8rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: colorVars['--color-white'],
    backgroundColor: colorVars['--color-statusError'],
    whiteSpace: 'nowrap',
  },
});

/** SEED 규칙: 0 은 숨김, 100 이상은 "99+" */
const formatBadgeCount = (count: number) => (count > 99 ? '99+' : String(count));

const Badge = ({ badge }: { badge: NonNullable<BottomNavigationItem['badge']> }) => {
  if (badge === 'dot') {
    return <span aria-label='새 알림 있음' role='status' {...stylex.props(styles.badgeDot)} />;
  }

  if (badge <= 0) {
    return null;
  }

  return (
    <span
      aria-label={`새 알림 ${badge}개`}
      role='status'
      {...stylex.props(typographyStyles.small3Bold, styles.badgeCount)}
    >
      {formatBadgeCount(badge)}
    </span>
  );
};

/**
 * 하단 내비게이션 — 앱 루트 화면 사이를 오가는 최상위 탭.
 *
 * woolbank 의 NavigationBar 를 당근 SEED Bottom Navigation 규칙과 합쳐 공용화했다.
 * - 탭은 최대 5개, 라벨은 짧게, 아이콘은 Fill 스타일을 색으로만 구분한다.
 * - 가운데 `centerAction` 은 탭이 아니라 "바로 이동" 버튼(글쓰기·가계부 추가)이다.
 * - 스크롤 방향 감지·라우터 연동·탭 애니메이션은 호출하는 쪽의 몫이다. `hidden` 과 `linkComponent` 로 연결한다.
 * @component
 */
export const BottomNavigation = ({
  items,
  value,
  onChange,
  linkComponent: LinkComponent = 'a',
  centerAction,
  position = 'fixed',
  hidden = false,
  xstyle,
}: BottomNavigationProps) => {
  if (process.env.NODE_ENV !== 'production' && items.length > BOTTOM_NAVIGATION_MAX_ITEMS) {
    console.warn(
      `[wds] BottomNavigation 은 탭을 최대 ${BOTTOM_NAVIGATION_MAX_ITEMS}개만 둔다 (${items.length}개 전달됨). 앞 ${BOTTOM_NAVIGATION_MAX_ITEMS}개만 그린다.`,
    );
  }

  const visibleItems = items.slice(0, BOTTOM_NAVIGATION_MAX_ITEMS);
  const centerIndex = Math.floor(visibleItems.length / 2);

  const renderTab = (item: BottomNavigationItem) => {
    const selected = item.value === value;
    const icon = selected && item.selectedIcon ? item.selectedIcon : item.icon;
    const content = (
      <>
        <span {...stylex.props(styles.iconWrap)} aria-hidden={item.badge === undefined ? 'true' : undefined}>
          {icon}
          {item.badge !== undefined && <Badge badge={item.badge} />}
        </span>
        <span {...stylex.props(typographyStyles.small2Medium, styles.label, selected && styles.labelSelected)}>
          {item.label}
        </span>
      </>
    );
    const tabStyle = stylex.props(styles.tab, selected && styles.tabSelected, item.disabled && styles.tabDisabled);
    const handleSelect = () => {
      if (item.disabled) return;
      onChange?.(item.value);
    };

    if (item.href && !item.disabled) {
      return (
        <LinkComponent
          href={item.href}
          aria-current={selected ? 'page' : undefined}
          onClick={handleSelect}
          data-value={item.value}
          {...tabStyle}
        >
          {content}
        </LinkComponent>
      );
    }

    return (
      <button
        type='button'
        aria-current={selected ? 'page' : undefined}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        onClick={handleSelect}
        data-value={item.value}
        {...tabStyle}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      aria-label='주 메뉴'
      {...stylex.props(
        styles.nav,
        position === 'fixed' ? styles.navFixed : styles.navStatic,
        hidden && styles.navHidden,
        xstyle,
      )}
    >
      <ul {...stylex.props(styles.list)}>
        {visibleItems.map((item, index) => (
          <Fragment key={item.value}>
            {centerAction && index === centerIndex && (
              <li {...stylex.props(styles.cell, styles.centerCell)} data-center-action>
                <button
                  type='button'
                  aria-label={centerAction.label}
                  onClick={centerAction.onClick}
                  {...stylex.props(styles.centerButton)}
                >
                  {centerAction.icon}
                </button>
              </li>
            )}
            <li {...stylex.props(styles.cell)}>{renderTab(item)}</li>
          </Fragment>
        ))}
      </ul>
    </nav>
  );
};
