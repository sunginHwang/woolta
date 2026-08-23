/** 하이라이트 종류 — 날짜 토큰인지 카테고리 토큰인지 구분한다. */
export type HighlightVariant = 'date' | 'category';

interface HighlightToken {
  /** 토큰 시작 인덱스 */
  startIndex: number;
  /** 토큰 끝 인덱스 (exclusive) */
  endIndex: number;
  /** 하이라이트 종류 */
  variant: HighlightVariant;
}

export interface HighlightSegment {
  /** 구간 시작 인덱스 (React key 로 사용) */
  startIndex: number;
  /** 구간 텍스트 */
  text: string;
  /** 하이라이트 종류. 일반 텍스트 구간이면 null */
  variant: HighlightVariant | null;
}

/**
 * 입력 텍스트를 하이라이트 구간과 일반 구간으로 나눈다. (mirror 렌더링용)
 * 토큰은 서로 겹치지 않는다고 가정하며, 시작 인덱스 순으로 정렬해 처리한다.
 * @param text 입력 텍스트
 * @param tokens 하이라이트할 토큰 목록
 */
export const buildHighlightSegments = (text: string, tokens: HighlightToken[]): HighlightSegment[] => {
  const segments: HighlightSegment[] = [];
  let cursor = 0;

  [...tokens]
    .sort((a, b) => a.startIndex - b.startIndex)
    .forEach(({ startIndex, endIndex, variant }) => {
      if (startIndex > cursor) {
        segments.push({ startIndex: cursor, text: text.slice(cursor, startIndex), variant: null });
      }
      segments.push({ startIndex, text: text.slice(startIndex, endIndex), variant });
      cursor = endIndex;
    });

  if (cursor < text.length) {
    segments.push({ startIndex: cursor, text: text.slice(cursor), variant: null });
  }

  return segments;
};
