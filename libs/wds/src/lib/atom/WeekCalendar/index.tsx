'use client';

import type { StyleXStyles } from '@stylexjs/stylex';
import * as stylex from '@stylexjs/stylex';
import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useId, useMemo, useRef } from 'react';
import { IconChevronDown } from '../../icons';
import { colorVars } from '../../style/tokens.stylex';
import { typographyStyles } from '../../style/typography.stylex';
import {
  addDays,
  findWeekIndex,
  formatDateLabel,
  getDayOfMonth,
  getWeekRows,
  type ISODate,
  isSameMonth,
  type WeekCalendarWeek,
} from './weekRows';

export type { ISODate, WeekCalendarWeek } from './weekRows';
export { addDays, findWeekIndex, getWeekRows, isSameMonth } from './weekRows';

export interface WeekCalendarDayContext {
  /** 보고 있는 달 밖(앞뒤 달)의 날짜 */
  isOutsideMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
}

export interface WeekCalendarProps {
  /** 보여줄 달 'YYYY-MM' */
  month: string;
  /** 선택된 날 'YYYY-MM-DD'. 접힌 상태에서는 이 날이 속한 주만 그린다 */
  selectedDate: ISODate;
  /** 오늘 'YYYY-MM-DD'. 주지 않으면 오늘 표시(테두리 원)를 하지 않는다 — SSR 불일치 방지는 호출부 몫 */
  today?: ISODate;
  /** true 면 한 달 전체, false 면 선택한 주 한 줄만 */
  expanded: boolean;
  /** 아래 토글 버튼이나 키보드 이동으로 펼침 상태가 바뀔 때 */
  onExpandedChange: (expanded: boolean) => void;
  /** 날짜를 탭하거나 키보드로 옮길 때 */
  onSelectDate: (date: ISODate) => void;
  /**
   * 주의 시작 요일. 0 = 일요일, 1 = 월요일
   * @default 0
   */
  weekStartsOn?: 0 | 1;
  /**
   * 요일 머리글 7개. weekStartsOn 에 맞춰 회전해 넘긴다
   * @default ['일','월','화','수','목','금','토'] (weekStartsOn 기준 회전)
   */
  weekdayLabels?: string[];
  /** 날짜 숫자 아래 영역(지출·수입 축약 등). 달 밖 날짜에도 호출되니 ctx.isOutsideMonth 로 거른다 */
  renderDayMeta?: (date: ISODate, ctx: WeekCalendarDayContext) => ReactNode;
  /** 펼친 상태에서만 각 주 아래에 그린다. null/undefined 를 돌려주면 그 행은 생략 */
  renderWeekSummary?: (week: WeekCalendarWeek) => ReactNode;
  /**
   * 달 밖 날짜도 선택할 수 있게 한다. 기본은 비활성(disabled) + textDisabled
   * @default false
   */
  allowOutsideMonth?: boolean;
  /**
   * 토글 버튼 aria-label
   * @default { expand: '한 달 전체 보기', collapse: '이번 주만 보기' }
   */
  toggleLabels?: { expand: string; collapse: string };
  /** 외부에서 주입하는 StyleX 스타일 — 루트에 마지막으로 머지된다 */
  xstyle?: StyleXStyles;
}

const DEFAULT_WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const DEFAULT_TOGGLE_LABELS = { expand: '한 달 전체 보기', collapse: '이번 주만 보기' };

const styles = stylex.create({
  root: {
    paddingInline: '1.2rem',
    paddingBlock: 0,
  },
  weekdays: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
    textAlign: 'center',
    paddingBottom: '0.4rem',
    color: colorVars['--color-textTertiary'],
  },
  week: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
  },
  day: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    width: '100%',
    minHeight: '5.6rem',
    paddingTop: '0.6rem',
    paddingBottom: '0.4rem',
    paddingInline: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    fontFamily: 'inherit',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  dayDisabled: {
    cursor: 'default',
  },
  number: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '3rem',
    height: '3rem',
    borderRadius: '50%',
    fontVariantNumeric: 'tabular-nums',
    color: colorVars['--color-textPrimary'],
    fontWeight: 400,
  },
  numberSelected: {
    backgroundColor: colorVars['--color-fillStrong'],
    color: colorVars['--color-textInverse'],
    fontWeight: 600,
  },
  numberToday: {
    boxShadow: `inset 0 0 0 1px ${colorVars['--color-borderStrong']}`,
    fontWeight: 600,
  },
  numberOutside: {
    color: colorVars['--color-textDisabled'],
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '3.2rem',
    paddingBlock: 0,
    paddingInline: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderStyle: 'none',
    borderRadius: '0.8rem',
    color: colorVars['--color-textTertiary'],
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    outlineWidth: {
      default: 0,
      ':focus-visible': '0.2rem',
    },
    outlineStyle: 'solid',
    outlineColor: colorVars['--color-statusInfo'],
    outlineOffset: '-0.2rem',
  },
  chevron: {
    display: 'inline-flex',
    transitionProperty: 'transform',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-out',
    transform: 'rotate(0deg)',
  },
  chevronExpanded: {
    transform: 'rotate(180deg)',
  },
});

/** 'YYYY-MM' → "2026년 11월" */
const formatMonthLabel = (month: string) => {
  const [year, m] = month.split('-').map(Number);

  return `${year}년 ${m}월`;
};

const rotateLabels = (labels: string[], weekStartsOn: 0 | 1) =>
  weekStartsOn === 0 ? labels : [...labels.slice(weekStartsOn), ...labels.slice(0, weekStartsOn)];

/**
 * 주 달력 — 기본은 선택한 주 한 줄, 아래 토글로 한 달을 펼친다.
 *
 * 데이터에 의존하지 않는다. 날짜 아래 금액이나 주 합계는 `renderDayMeta` / `renderWeekSummary` 로 호출부가 그린다.
 * 날짜 계산은 dayjs 없이 UTC 문자열 산술(weekRows.ts)만 쓰므로 호스트 타임존에 영향받지 않는다.
 * @component
 */
export const WeekCalendar = ({
  month,
  selectedDate,
  today,
  expanded,
  onExpandedChange,
  onSelectDate,
  weekStartsOn = 0,
  weekdayLabels,
  renderDayMeta,
  renderWeekSummary,
  allowOutsideMonth = false,
  toggleLabels = DEFAULT_TOGGLE_LABELS,
  xstyle,
}: WeekCalendarProps) => {
  const gridId = useId();
  const rows = useMemo(() => getWeekRows(month, weekStartsOn), [month, weekStartsOn]);
  const labels = rotateLabels(weekdayLabels ?? DEFAULT_WEEKDAY_LABELS, weekStartsOn);

  const selectedIndex = findWeekIndex(rows, selectedDate);
  const todayIndex = findWeekIndex(rows, today);
  const visibleIndex = selectedIndex >= 0 ? selectedIndex : todayIndex >= 0 ? todayIndex : 0;
  const visibleRows = expanded ? rows : [rows[visibleIndex]];

  // 키보드로 옮긴 직후에만 새 셀로 포커스를 따라가게 한다 — 탭/프로그램 변경에는 포커스를 건드리지 않는다
  const cellRefs = useRef(new Map<ISODate, HTMLButtonElement>());
  const pendingFocusRef = useRef<ISODate | null>(null);

  useEffect(() => {
    if (pendingFocusRef.current && pendingFocusRef.current === selectedDate) {
      cellRefs.current.get(selectedDate)?.focus();
      pendingFocusRef.current = null;
    }
  });

  const canSelect = (date: ISODate) => allowOutsideMonth || isSameMonth(date, month);

  const moveTo = (target: ISODate) => {
    if (!canSelect(target)) {
      return;
    }

    const targetRow = findWeekIndex(rows, target);

    if (targetRow === -1) {
      return;
    }

    if (!expanded && targetRow !== visibleIndex) {
      onExpandedChange(true);
    }

    pendingFocusRef.current = target;
    onSelectDate(target);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, date: ISODate, row: WeekCalendarWeek) => {
    const moves: Record<string, () => ISODate> = {
      ArrowLeft: () => addDays(date, -1),
      ArrowRight: () => addDays(date, 1),
      ArrowUp: () => addDays(date, -7),
      ArrowDown: () => addDays(date, 7),
      Home: () => row.dates[0],
      End: () => row.dates[6],
    };
    const move = moves[event.key];

    if (!move) {
      return;
    }

    event.preventDefault();
    moveTo(move());
  };

  const setCellRef = (date: ISODate) => (node: HTMLButtonElement | null) => {
    if (node) {
      cellRefs.current.set(date, node);
    } else {
      cellRefs.current.delete(date);
    }
  };

  return (
    <div {...stylex.props(styles.root, xstyle)}>
      {/* WAI-ARIA grid 패턴 — 달력은 2차원 이동(←→↑↓)이 있어 table/list 시맨틱보다 grid 가 맞다.
          비선택 셀은 tabIndex=-1(로빙)이라 "포커스 불가" 경고가 뜨지만 의도된 동작이다. */}
      {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid 패턴 */}
      <div id={gridId} role='grid' aria-label={`${formatMonthLabel(month)} 달력`}>
        {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid 패턴 */}
        {/* biome-ignore lint/a11y/useFocusableInteractive: row 는 포커스 대상이 아니다 */}
        <div role='row' {...stylex.props(typographyStyles.small1Medium, styles.weekdays)}>
          {labels.map((label) => (
            // biome-ignore lint/a11y/useSemanticElements: ARIA grid 패턴
            // biome-ignore lint/a11y/useFocusableInteractive: 머리글은 포커스 대상이 아니다
            <span key={label} role='columnheader'>
              {label}
            </span>
          ))}
        </div>
        {visibleRows.map((row) => {
          const summary = expanded ? renderWeekSummary?.(row) : null;

          return (
            <div key={row.index}>
              {/* biome-ignore lint/a11y/useSemanticElements: ARIA grid 패턴 */}
              {/* biome-ignore lint/a11y/useFocusableInteractive: row 는 포커스 대상이 아니다 */}
              <div role='row' {...stylex.props(styles.week)}>
                {row.dates.map((date) => {
                  const isOutsideMonth = !isSameMonth(date, month);
                  const isSelected = date === selectedDate;
                  const isToday = date === today;
                  const disabled = isOutsideMonth && !allowOutsideMonth;

                  return (
                    // biome-ignore lint/a11y/useSemanticElements: ARIA grid 패턴 — 셀은 버튼이면서 gridcell
                    <button
                      key={date}
                      ref={setCellRef(date)}
                      type='button'
                      role='gridcell'
                      aria-selected={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      aria-label={formatDateLabel(date)}
                      tabIndex={isSelected ? 0 : -1}
                      disabled={disabled}
                      onClick={() => onSelectDate(date)}
                      onKeyDown={(event) => handleKeyDown(event, date, row)}
                      {...stylex.props(styles.day, disabled && styles.dayDisabled)}
                    >
                      <span
                        {...stylex.props(
                          typographyStyles.body2,
                          styles.number,
                          isOutsideMonth && styles.numberOutside,
                          isToday && !isSelected && styles.numberToday,
                          isSelected && styles.numberSelected,
                        )}
                      >
                        {getDayOfMonth(date)}
                      </span>
                      {renderDayMeta?.(date, { isOutsideMonth, isSelected, isToday })}
                    </button>
                  );
                })}
              </div>
              {summary != null && summary !== false && <div>{summary}</div>}
            </div>
          );
        })}
      </div>
      <button
        type='button'
        aria-expanded={expanded}
        aria-controls={gridId}
        aria-label={expanded ? toggleLabels.collapse : toggleLabels.expand}
        onClick={() => onExpandedChange(!expanded)}
        {...stylex.props(styles.toggle)}
      >
        <span aria-hidden='true' {...stylex.props(styles.chevron, expanded && styles.chevronExpanded)}>
          <IconChevronDown size={24} />
        </span>
      </button>
    </div>
  );
};
