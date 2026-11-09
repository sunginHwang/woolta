'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ElementType, ReactNode } from 'react';
import { forwardRef } from 'react';
import { IconChevronRight } from '../../icons/ChevronRight';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

/** 앞쪽 아이콘 원의 배경 톤 */
export type ListRowLeadingTone = 'neutral' | 'primary' | 'income';

/** 오른쪽 값 글자색 — default 잉크 / income 파랑 / expense 잉크 / secondary 회색 */
export type ListRowValueTone = 'default' | 'income' | 'expense' | 'secondary';

export interface ListRowProps {
  /** 앞쪽 36px 원 안에 들어갈 아이콘·이미지. 없으면 원도 그리지 않는다 */
  leading?: ReactNode;
  /**
   * 앞쪽 원의 배경 톤. neutral fillSubtle / primary 옅은 코랄 / income 옅은 파랑
   * @default 'neutral'
   */
  leadingTone?: ListRowLeadingTone;
  /** 제목. 한 줄, 넘치면 말줄임 */
  title: ReactNode;
  /** 제목 아래 보조 설명 (카테고리·날짜·상태 문구) */
  subtitle?: ReactNode;
  /** 오른쪽 값. 금액처럼 숫자면 tabular-nums 로 자리가 흔들리지 않는다 */
  value?: ReactNode;
  /**
   * 값 글자색
   * @default 'default'
   */
  valueTone?: ListRowValueTone;
  /** 값 뒤에 두는 임의 노드 — Toggle·Badge·Tag. 행 자체 클릭과 겹치지 않게 쓴다 */
  trailing?: ReactNode;
  /**
   * 오른쪽 끝 화살표. 다른 화면으로 이동하는 행에 켠다
   * @default false
   */
  chevron?: boolean;
  /** 있으면 `linkComponent` 로 그린다 (이동 행). `onClick` 보다 우선 */
  href?: string;
  /**
   * `href` 가 있을 때 쓸 링크 컴포넌트. Next 앱은 `Link` 를 넘긴다
   * @default 'a'
   */
  linkComponent?: ElementType;
  /** 있으면 `<button>` 으로 그린다 (시트 열기·선택 등 화면 안 동작) */
  onClick?: () => void;
  /**
   * 비활성. 흐리게 두고 클릭·포커스를 막는다
   * @default false
   */
  disabled?: boolean;
  /**
   * 아래 1px 구분선
   * @default false
   */
  divider?: boolean;
  /** 접근성 이름. 제목만으로 뜻이 모자랄 때 (예: "주간 예산, 현재 450,000원"). 링크·버튼 행에만 적용된다 */
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: '5.6rem',
    paddingBlock: '1.2rem',
    paddingInline: '1.6rem',
    marginBlock: 0,
    marginInline: 0,
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    color: colorVars['--color-textPrimary'],
    textAlign: 'left',
    textDecoration: 'none',
    fontFamily: 'inherit',
  },
  interactive: {
    cursor: 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    transitionProperty: 'background-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease',
    backgroundColor: {
      default: 'transparent',
      ':hover': colorVars['--color-fillSubtle'],
      ':active': colorVars['--color-fillSubtle'],
    },
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  disabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  divider: {
    boxShadow: `inset 0 -1px 0 0 ${colorVars['--color-borderSubtle']}`,
  },
  leading: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '3.6rem',
    height: '3.6rem',
    borderRadius: '50%',
    overflow: 'hidden',
    color: colorVars['--color-textSecondary'],
  },
  leadingNeutral: { backgroundColor: colorVars['--color-fillSubtle'] },
  leadingPrimary: {
    backgroundColor: colorVars['--color-interactivePrimarySubtle'],
    color: colorVars['--color-interactivePrimaryText'],
  },
  leadingIncome: {
    backgroundColor: colorVars['--color-finIncomeSubtle'],
    color: colorVars['--color-finIncome'],
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  title: {
    color: colorVars['--color-textPrimary'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  subtitle: {
    color: colorVars['--color-textSecondary'],
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  value: {
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
  valueDefault: { color: colorVars['--color-textPrimary'] },
  valueIncome: { color: colorVars['--color-finIncome'] },
  valueExpense: { color: colorVars['--color-finExpense'] },
  valueSecondary: { color: colorVars['--color-textSecondary'] },
  trailing: {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  chevron: {
    display: 'inline-flex',
    flexShrink: 0,
    marginLeft: '-0.4rem',
    color: colorVars['--color-textTertiary'],
  },
  sectionHeader: {
    display: 'block',
    boxSizing: 'border-box',
    paddingTop: '2.8rem',
    paddingInline: '1.6rem',
    paddingBottom: '0.8rem',
    marginBlock: 0,
    marginInline: 0,
    color: colorVars['--color-textTertiary'],
  },
});

const LEADING_TONE = {
  neutral: styles.leadingNeutral,
  primary: styles.leadingPrimary,
  income: styles.leadingIncome,
} as const;

const VALUE_TONE = {
  default: styles.valueDefault,
  income: styles.valueIncome,
  expense: styles.valueExpense,
  secondary: styles.valueSecondary,
} as const;

/**
 * 목록의 한 행 — 앞 아이콘 · 제목/부제 · 오른쪽 값 · (토글·화살표).
 *
 * 가계부 내역, 설정 메뉴, 시트 안 목록처럼 "세로로 쌓이는 같은 모양의 행"에 쓴다.
 * - `href` 가 있으면 링크, `onClick` 이 있으면 버튼, 둘 다 없으면 정적 `div` 로 그린다.
 * - 행 전체가 눌리는 경우 `trailing` 에 또 다른 버튼(Toggle)을 두지 않는다 — 중첩 인터랙션이 된다.
 * - 금액은 호출부에서 부호(+ / −)까지 붙여 `value` 로 넘기고, 색은 `valueTone` 으로 고른다.
 * @component
 */
export const ListRow = forwardRef<HTMLElement, ListRowProps>(
  (
    {
      leading,
      leadingTone = 'neutral',
      title,
      subtitle,
      value,
      valueTone = 'default',
      trailing,
      chevron = false,
      href,
      linkComponent: LinkComponent = 'a',
      onClick,
      disabled = false,
      divider = false,
      'aria-label': ariaLabel,
      xstyle,
    },
    ref,
  ) => {
    const isLink = typeof href === 'string' && !disabled;
    const isButton = !isLink && typeof onClick === 'function';
    const interactive = isLink || isButton;

    const sx = stylex.props(
      styles.root,
      interactive && styles.interactive,
      disabled && styles.disabled,
      divider && styles.divider,
      xstyle,
    );

    const content = (
      <>
        {leading !== undefined && (
          <span {...stylex.props(styles.leading, LEADING_TONE[leadingTone])} aria-hidden='true'>
            {leading}
          </span>
        )}
        <span {...stylex.props(styles.body)}>
          <span {...stylex.props(typographyStyles.body2, styles.title)}>{title}</span>
          {subtitle !== undefined && (
            <span {...stylex.props(typographyStyles.body4Regular, styles.subtitle)}>{subtitle}</span>
          )}
        </span>
        {value !== undefined && (
          <span {...stylex.props(typographyStyles.title5Medium, styles.value, VALUE_TONE[valueTone])}>{value}</span>
        )}
        {trailing !== undefined && <span {...stylex.props(styles.trailing)}>{trailing}</span>}
        {chevron && (
          <span {...stylex.props(styles.chevron)} aria-hidden='true'>
            <IconChevronRight size={20} />
          </span>
        )}
      </>
    );

    if (isLink) {
      return (
        <LinkComponent ref={ref} href={href} aria-label={ariaLabel} onClick={onClick} {...sx}>
          {content}
        </LinkComponent>
      );
    }

    if (isButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type='button'
          aria-label={ariaLabel}
          disabled={disabled}
          onClick={onClick}
          {...sx}
        >
          {content}
        </button>
      );
    }

    return (
      <div ref={ref as React.Ref<HTMLDivElement>} aria-disabled={disabled || undefined} {...sx}>
        {content}
      </div>
    );
  },
);

ListRow.displayName = 'ListRow';

export interface ListSectionHeaderProps {
  /** 섹션 이름 — "예산", "알림" 처럼 짧은 명사 */
  children: ReactNode;
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

/**
 * ListRow 묶음 위에 두는 작은 섹션 제목. 위 여백 28px 로 묶음 사이 간격을 겸한다.
 * 첫 섹션의 위 여백을 줄이고 싶으면 `xstyle` 로 `paddingTop` 을 덮어쓴다.
 * @component
 */
export const ListSectionHeader = ({ children, xstyle }: ListSectionHeaderProps) => (
  <h3 {...stylex.props(typographyStyles.small1Medium, styles.sectionHeader, xstyle)}>{children}</h3>
);
