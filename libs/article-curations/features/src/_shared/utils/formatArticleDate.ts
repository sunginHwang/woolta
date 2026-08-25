/** ISO 날짜 문자열을 테이블 표기용(YYYY.MM.DD)으로 변환한다. */
export const formatArticleDate = (isoDate: string) => isoDate.slice(0, 10).replace(/-/g, '.');
