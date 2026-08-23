import { TodoCategory } from '../types';

export interface ParsedCategoryToken {
  /** 매칭된 토큰 원문 (`#` 를 붙여 입력했다면 포함) */
  text: string;
  /** 토큰 시작 인덱스 */
  startIndex: number;
  /** 토큰 끝 인덱스 (exclusive) */
  endIndex: number;
}

export interface ParsedCategoryResult {
  /** 매칭된 토큰 정보 */
  token: ParsedCategoryToken;
  /** 매칭된 카테고리 id */
  categoryId: string;
}

/** 카테고리 이름을 정규식에 그대로 쓰기 위해 특수문자를 이스케이프한다. */
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 텍스트에서 기존 카테고리 이름과 일치하는 토큰을 찾아 등장 순서대로 반환한다.
 * `#업무` 처럼 앞에 `#` 를 붙여도 인식하며, 앞뒤가 공백이나 문자열 경계일 때만 매칭한다.
 * 이름이 긴 카테고리를 먼저 검사해 짧은 이름에 가려지지 않게 한다.
 * @param text 입력 텍스트
 * @param categories 매칭 대상 카테고리 목록
 */
export const parseCategoryTokens = (text: string, categories: TodoCategory[]): ParsedCategoryResult[] => {
  const results: ParsedCategoryResult[] = [];
  const categoriesByNameLength = [...categories].sort((a, b) => b.name.trim().length - a.name.trim().length);

  categoriesByNameLength.forEach((category) => {
    const name = category.name.trim();
    if (name.length === 0) {
      return;
    }

    const regex = new RegExp(`(?<=^|\\s)#?${escapeRegExp(name)}(?=\\s|$)`, 'g');
    let match = regex.exec(text);

    while (match !== null) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;
      const isOverlapped = results.some(({ token }) => startIndex < token.endIndex && endIndex > token.startIndex);

      if (!isOverlapped) {
        results.push({ token: { text: match[0], startIndex, endIndex }, categoryId: category.id });
      }
      match = regex.exec(text);
    }
  });

  return results.sort((a, b) => a.token.startIndex - b.token.startIndex);
};
