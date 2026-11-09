'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { useRef } from 'react';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';

export type TimelineItemTone = 'default' | 'primary';

export interface TimelineItem {
  /** 행 식별자. `data-key` 로도 나가므로 호출부가 `scrollIntoView` 대상으로 찾을 수 있다 */
  key: string;
  /** 왼쪽 날짜 열 — `{ top: '11월', bottom: '15' }` */
  dateLabel: { top: ReactNode; bottom: ReactNode };
  /** 제목 (이체명) */
  title: ReactNode;
  /** 제목 아래 보조 설명 (카테고리 등) */
  description?: ReactNode;
  /** 오른쪽 값 (금액). tabular-nums 로 정렬된다 */
  value?: ReactNode;
  /** 행 전체 클릭. 있으면 `<button>` 으로 그린다 */
  onClick?: () => void;
  /** 700ms 길게 누르기. 있으면 컨텍스트 메뉴를 막고 길게 누른 뒤의 클릭은 무시한다 */
  onLongPress?: () => void;
  /**
   * 점 색. `primary` 면 interactivePrimary, 아니면 borderStrong.
   * `highlightFirst` 로 첫 행이 primary 가 되는 것과 별개로 행 단위로 강제할 때 쓴다
   */
  tone?: TimelineItemTone;
  /**
   * 비활성 — 흐리게 그리고 클릭을 막는다
   * @default false
   */
  disabled?: boolean;
}

export interface TimelineProps {
  /** 날짜순으로 정렬된 항목. 정렬은 호출부 책임이다 */
  items: TimelineItem[];
  /**
   * 첫 행의 점을 primary 로 칠한다 (다음 이체 강조)
   * @default true
   */
  highlightFirst?: boolean;
  /** 강조할 행 키들 — 배경을 fillSubtle 로 잠깐 표시하는 용도(7일 안에 빠져나가는 항목으로 이동했을 때) */
  activeKeys?: string[];
  /** 항목이 없을 때 대신 그릴 노드 */
  empty?: ReactNode;
  /** 목록의 접근성 이름 — "이체 일정" */
  'aria-label'?: string;
  /** 외부에서 주입하는 StyleX 스타일 — 루트(ol)에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const LONG_PRESS_MS = 700;

const styles = stylex.create({
  list: {
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInline: 0,
  },
  row: {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: '4rem 1.6rem minmax(0, 1fr)',
    columnGap: '0.8rem',
    minHeight: '6.4rem',
    borderRadius: '0.8rem',
    transitionProperty: 'background-color',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
  },
  rowActive: {
    backgroundColor: colorVars['--color-fillSubtle'],
  },
  rowButton: {
    width: '100%',
    textAlign: 'left',
    borderWidth: 0,
    borderStyle: 'none',
    backgroundColor: 'transparent',
    paddingBlock: 0,
    paddingInline: 0,
    fontFamily: 'inherit',
    color: 'inherit',
    cursor: {
      default: 'pointer',
      ':disabled': 'not-allowed',
    },
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  rowDisabled: {
    opacity: 0.45,
  },
  date: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '1rem',
    lineHeight: 1,
  },
  dateTop: {
    color: colorVars['--color-textTertiary'],
  },
  dateBottom: {
    marginTop: '0.4rem',
    fontSize: '1.7rem',
    lineHeight: '2rem',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    color: colorVars['--color-textPrimary'],
  },
  rail: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  railLine: {
    width: '1px',
    backgroundColor: colorVars['--color-borderSubtle'],
  },
  railLineTop: {
    height: '1.4rem',
    flexShrink: 0,
  },
  railLineBottom: {
    flexGrow: 1,
  },
  railLineHidden: {
    backgroundColor: 'transparent',
  },
  dot: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    flexShrink: 0,
    backgroundColor: colorVars['--color-borderStrong'],
  },
  dotPrimary: {
    backgroundColor: colorVars['--color-interactivePrimary'],
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    paddingBlock: '1rem',
    paddingRight: '0.4rem',
    boxShadow: `inset 0 -1px 0 ${colorVars['--color-borderSubtle']}`,
  },
  bodyLast: {
    boxShadow: 'none',
  },
  text: {
    flexGrow: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  title: {
    color: colorVars['--color-textPrimary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    color: colorVars['--color-textSecondary'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  value: {
    flexShrink: 0,
    color: colorVars['--color-textPrimary'],
    fontVariantNumeric: 'tabular-nums',
    whiteSpace: 'nowrap',
  },
});

interface RowProps {
  item: TimelineItem;
  isFirst: boolean;
  isLast: boolean;
  isPrimary: boolean;
  isActive: boolean;
}

const TimelineRow = ({ item, isFirst, isLast, isPrimary, isActive }: RowProps) => {
  const { dateLabel, title, description, value, onClick, onLongPress, disabled = false } = item;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePointerDown = () => {
    if (!onLongPress || disabled) return;
    longPressedRef.current = false;
    clearTimer();
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      onLongPress();
    }, LONG_PRESS_MS);
  };

  const handleClick = () => {
    // 길게 누른 뒤 손을 떼면 click 도 같이 오므로 한 번 삼킨다
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    onClick?.();
  };

  const isInteractive = Boolean(onClick || onLongPress);

  const content = (
    <>
      <span aria-hidden='true' {...stylex.props(styles.date)}>
        <span {...stylex.props(typographyStyles.small2Medium, styles.dateTop)}>{dateLabel.top}</span>
        <span {...stylex.props(styles.dateBottom)}>{dateLabel.bottom}</span>
      </span>
      <span aria-hidden='true' {...stylex.props(styles.rail)}>
        <span {...stylex.props(styles.railLine, styles.railLineTop, isFirst && styles.railLineHidden)} />
        <span
          data-tone={isPrimary ? 'primary' : 'default'}
          {...stylex.props(styles.dot, isPrimary && styles.dotPrimary)}
        />
        <span {...stylex.props(styles.railLine, styles.railLineBottom, isLast && styles.railLineHidden)} />
      </span>
      <span {...stylex.props(styles.body, isLast && styles.bodyLast)}>
        <span {...stylex.props(styles.text)}>
          <span {...stylex.props(typographyStyles.title5Medium, styles.title)}>{title}</span>
          {description && (
            <span {...stylex.props(typographyStyles.small1Regular, styles.description)}>{description}</span>
          )}
        </span>
        {value !== undefined && <span {...stylex.props(typographyStyles.title5Medium, styles.value)}>{value}</span>}
      </span>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type='button'
        disabled={disabled}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={clearTimer}
        onPointerLeave={clearTimer}
        onPointerCancel={clearTimer}
        onContextMenu={onLongPress ? (event) => event.preventDefault() : undefined}
        {...stylex.props(styles.row, styles.rowButton, isActive && styles.rowActive, disabled && styles.rowDisabled)}
      >
        {content}
      </button>
    );
  }

  return (
    <div {...stylex.props(styles.row, isActive && styles.rowActive, disabled && styles.rowDisabled)}>{content}</div>
  );
};

/**
 * 날짜순 일정을 세로 선과 점으로 잇는 타임라인. 정기지출 "이체 일정" 카드의 본문이다.
 *
 * - 왼쪽은 월·일, 가운데는 점과 선, 오른쪽은 제목·설명·금액.
 * - 첫 행의 점은 기본으로 primary (다음에 빠져나갈 이체). `tone` 으로 행 단위 강제도 된다.
 * - 각 `<li>` 에 `data-key` 가 나가므로 호출부가 특정 행으로 스크롤하거나 `activeKeys` 로 잠깐 강조할 수 있다.
 * @component
 */
export const Timeline = ({
  items,
  highlightFirst = true,
  activeKeys,
  empty,
  'aria-label': ariaLabel,
  xstyle,
}: TimelineProps) => {
  if (items.length === 0) {
    return empty ?? null;
  }

  const activeSet = new Set(activeKeys ?? []);

  return (
    <ol aria-label={ariaLabel} {...stylex.props(styles.list, xstyle)}>
      {items.map((item, index) => (
        <li key={item.key} data-key={item.key}>
          <TimelineRow
            item={item}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            isPrimary={item.tone === 'primary' || (highlightFirst && index === 0 && item.tone !== 'default')}
            isActive={activeSet.has(item.key)}
          />
        </li>
      ))}
    </ol>
  );
};
