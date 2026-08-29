import dayjs, { type Dayjs } from 'dayjs';

export interface ParsedDateToken {
  /** 매칭된 토큰 원문 */
  text: string;
  /** 토큰 시작 인덱스 */
  startIndex: number;
  /** 토큰 끝 인덱스 (exclusive) */
  endIndex: number;
}

export interface ParsedDateResult {
  /** 매칭된 토큰 정보 */
  token: ParsedDateToken;
  /** 해석된 날짜 (YYYY-MM-DD) */
  date: string;
}

const WEEKDAY_INDEX: Record<string, number> = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };

/** 기준일 이후(당일 포함) 가장 가까운 해당 요일을 반환한다. */
const getUpcomingWeekday = (base: Dayjs, weekday: number) => {
  const diff = (weekday - base.day() + 7) % 7;
  return base.add(diff, 'day');
};

/** 기준일의 다음 주(월요일 시작) 해당 요일을 반환한다. */
const getNextWeekWeekday = (base: Dayjs, weekday: number) => {
  const daysUntilNextMonday = base.day() === 1 ? 7 : (1 - base.day() + 7) % 7;
  const nextMonday = base.add(daysUntilNextMonday, 'day');
  const offset = (weekday - 1 + 7) % 7;
  return nextMonday.add(offset, 'day');
};

/** 월/일 값이 유효한 날짜인지 검사하고 dayjs 객체를 반환한다. (유효하지 않으면 null) */
const buildDate = (year: number, month: number, day: number) => {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const date = dayjs(`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  return date.isValid() && date.month() + 1 === month && date.date() === day ? date : null;
};

/** 연도 없는 월/일 표현을 해석한다. 기준일보다 과거면 내년으로 넘긴다. */
const resolveMonthDay = (base: Dayjs, month: number, day: number) => {
  const thisYear = buildDate(base.year(), month, day);
  if (thisYear === null) {
    return null;
  }
  return thisYear.format('YYYY-MM-DD') < base.format('YYYY-MM-DD') ? buildDate(base.year() + 1, month, day) : thisYear;
};

interface TokenPattern {
  regex: RegExp;
  resolve: (match: RegExpExecArray, base: Dayjs) => Dayjs | null;
}

/**
 * 토큰 패턴 목록.
 * 앞뒤가 공백/문자열 경계일 때만 매칭한다. (예: "오늘의집 정리"의 "오늘"은 미매칭)
 */
const DATE_TOKEN_PATTERNS: TokenPattern[] = [
  {
    // 상대어: 오늘 / 내일 / 모레
    regex: /(?<=^|\s)(오늘|내일|모레)(?=\s|$)/g,
    resolve: (match, base) => {
      const offset = { 오늘: 0, 내일: 1, 모레: 2 }[match[1]] ?? 0;
      return base.add(offset, 'day');
    },
  },
  {
    // 이번주/다음주 요일 또는 요일 단독 (지난 요일이면 다음 주로)
    regex: /(?<=^|\s)((이번\s?주|다음\s?주)\s?)?([월화수목금토일])요일(?=\s|$)/g,
    resolve: (match, base) => {
      const weekday = WEEKDAY_INDEX[match[3]];
      const isNextWeek = match[2]?.startsWith('다음') ?? false;
      return isNextWeek ? getNextWeekWeekday(base, weekday) : getUpcomingWeekday(base, weekday);
    },
  },
  {
    // 다음주 (단독) → 다음 주 월요일
    regex: /(?<=^|\s)다음\s?주(?=\s|$)/g,
    resolve: (_match, base) => getNextWeekWeekday(base, 1),
  },
  {
    // YYYY-MM-DD
    regex: /(?<=^|\s)(\d{4})-(\d{1,2})-(\d{1,2})(?=\s|$)/g,
    resolve: (match) => buildDate(Number(match[1]), Number(match[2]), Number(match[3])),
  },
  {
    // M월 D일
    regex: /(?<=^|\s)(\d{1,2})월\s?(\d{1,2})일(?=\s|$)/g,
    resolve: (match, base) => resolveMonthDay(base, Number(match[1]), Number(match[2])),
  },
  {
    // M/D 또는 M.D
    regex: /(?<=^|\s)(\d{1,2})[/.](\d{1,2})(?=\s|$)/g,
    resolve: (match, base) => resolveMonthDay(base, Number(match[1]), Number(match[2])),
  },
];

/**
 * 텍스트에서 날짜 표현 토큰을 모두 찾아 등장 순서대로 반환한다.
 * @param text 입력 텍스트
 * @param baseDate 기준일 (YYYY-MM-DD)
 */
export const parseDateTokens = (text: string, baseDate: string): ParsedDateResult[] => {
  const base = dayjs(baseDate);
  const results: ParsedDateResult[] = [];

  DATE_TOKEN_PATTERNS.forEach(({ regex, resolve }) => {
    regex.lastIndex = 0;
    let match = regex.exec(text);

    while (match !== null) {
      const date = resolve(match, base);
      const isOverlapped = results.some(
        ({ token }) =>
          match !== null && match.index < token.endIndex && match.index + match[0].length > token.startIndex,
      );

      if (date !== null && !isOverlapped) {
        results.push({
          token: { text: match[0], startIndex: match.index, endIndex: match.index + match[0].length },
          date: date.format('YYYY-MM-DD'),
        });
      }
      match = regex.exec(text);
    }
  });

  return results.sort((a, b) => a.token.startIndex - b.token.startIndex);
};
