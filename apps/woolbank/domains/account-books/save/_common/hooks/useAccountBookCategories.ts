/**
 * 가계부 카테고리 — 데이터 계층은 libs 가 소유한다(woolta-api GraphQL).
 *
 * 이 앱과 대시보드가 같은 도메인을 쓰므로 조회·캐시·프리페치를 한곳에 모은다.
 * 화면 구조는 그대로 두기 위해 경로만 유지하고 내용은 재export 한다.
 */
export type {
  AccountBookCategory,
  AccountBookCategoryForm,
  AccountBookCategoryType,
  SaveAccountBookCategoryForm,
} from '@woolta/woolbank-features';
export { useAccountBookCategories } from '@woolta/woolbank-features';
