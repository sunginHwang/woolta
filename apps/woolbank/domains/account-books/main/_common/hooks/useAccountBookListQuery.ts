/**
 * 가계부 목록 — 데이터 계층은 libs 가 소유한다(woolta-api GraphQL).
 * 화면 구조는 그대로 두기 위해 경로만 유지하고 내용은 재export 한다.
 */
export type { AcccountBookType, AccountBook } from '@woolta/woolbank-features';
export { fetchAccountBookList, getAccountBookListQueryKey, prefetchAccountBookList } from '@woolta/woolbank-features';
