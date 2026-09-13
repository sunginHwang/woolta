/**
 * 가계부 타입 유틸 — libs 를 단일 출처로 삼는다.
 *
 * GraphQL enum 은 UPPER_CASE(`EXPENDITURE` / `INCOME`)다. 앱에서 소문자로 따로 선언하면
 * 카테고리 필터(`categories.filter(a => a.type === type)`)가 에러 없이 빈 배열이 된다.
 */
export type { AccountBookCategoryType } from '@woolta/woolbank-features';
export { getCategoryMsg as default } from '@woolta/woolbank-features';
