/**
 * 선택된 월 — libs 의 atom 을 그대로 쓴다.
 *
 * 같은 모양으로 따로 선언하면 jotai atom 인스턴스가 달라져, 월 선택은 앱 atom 에 쓰고
 * 목록 조회는 libs atom 을 읽는 불일치가 생긴다(에러 없이 월 전환만 안 먹는다).
 */
export { selectedAccountBookDateAtom } from '@woolta/woolbank-features';
