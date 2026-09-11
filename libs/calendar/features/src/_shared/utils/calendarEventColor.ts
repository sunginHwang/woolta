import { colorVars } from '@wds/tokens.stylex';

/**
 * 일정 색상 팔레트.
 *
 * 서버는 `color` 에 이 키만 저장한다(hex 를 받지 않는다) — 값을 그대로 저장하면
 * 다크 테마나 토큰 교체 때 캘린더만 옛 색으로 남는다. 미지정/알 수 없는 키는 기본색으로 떨어진다.
 */
export const CALENDAR_EVENT_COLORS = ['blue', 'pink', 'green', 'orange', 'red'] as const;

export type CalendarEventColorKey = (typeof CALENDAR_EVENT_COLORS)[number];

/** 진한 솔리드 색 — 경계선, 공유 일정 좌측 바 등 강조 포인트에 쓴다 */
const COLOR_BY_KEY: Record<CalendarEventColorKey, string> = {
  blue: colorVars['--color-blue500'],
  pink: colorVars['--color-pink500'],
  // raw 팔레트의 green200(#6E827F)은 회녹색이라 틴트로 깔면 초록으로 안 읽힌다.
  // statusSuccess 는 실제 초록이고 다크 오버라이드도 있어 테마를 따라간다.
  green: colorVars['--color-statusSuccess'],
  orange: colorVars['--color-orange500'],
  red: colorVars['--color-red500'],
};

/** pill 배경 틴트 농도 — 색은 알아보되 글자를 누르지 않는 선 */
const TINT_PERCENT = 22;

/**
 * 월 뷰 pill 배경 — 솔리드 색을 반투명하게 깔아 현재 배경 위에 합성한다.
 *
 * 팔레트의 라이트 단계(blue100 등)를 배경으로 쓰면 안 된다 — darkTheme.css 는
 * semantic 토큰만 재정의하고 raw 팔레트는 라이트 값으로 고정이라, 다크에서
 * `#E1E5FF` 같은 밝은 블록이 그대로 떠버린다. 반투명 틴트는 양쪽 테마를 다 따라간다.
 */
const BG_TINT_BY_KEY: Record<CalendarEventColorKey, string> = Object.fromEntries(
  CALENDAR_EVENT_COLORS.map((key) => [key, `color-mix(in srgb, ${COLOR_BY_KEY[key]} ${TINT_PERCENT}%, transparent)`]),
) as Record<CalendarEventColorKey, string>;

export const DEFAULT_CALENDAR_EVENT_COLOR: CalendarEventColorKey = 'blue';

const isColorKey = (color: string): color is CalendarEventColorKey =>
  (CALENDAR_EVENT_COLORS as readonly string[]).includes(color);

const toKey = (color: string | null | undefined): CalendarEventColorKey =>
  color && isColorKey(color) ? color : DEFAULT_CALENDAR_EVENT_COLOR;

/** 진한 솔리드 색 (경계선, 공유 일정 좌측 바용) */
export const resolveEventColor = (color: string | null | undefined) => COLOR_BY_KEY[toKey(color)];

/** 은은한 배경 틴트 (pill 배경) */
export const resolveEventBgTint = (color: string | null | undefined) => BG_TINT_BY_KEY[toKey(color)];

/**
 * 틴트 위 글자색.
 *
 * 색상별 팔레트 단계를 쓰지 않고 semantic 토큰 하나로 고정한다 — 반투명 틴트는 아래
 * 배경이 비치므로 어떤 고정 색을 골라도 한쪽 테마에서 대비가 무너진다.
 * textPrimary 는 테마를 따라 뒤집히므로 양쪽에서 안전하고, 색 구분은 틴트와 좌측 바가 맡는다.
 */
export const resolveEventTextColor = () => colorVars['--color-textPrimary'];

export const toColorKey = (color: string | null | undefined): CalendarEventColorKey => toKey(color);
