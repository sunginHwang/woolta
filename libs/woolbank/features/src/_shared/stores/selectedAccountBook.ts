import { atom } from 'jotai';

/**
 * 대시보드(woolta) 우측 패널에서 상세를 보여줄 가계부 내역 id.
 * null 이면 선택 없음(빈 패널).
 */
export const selectedAccountBookIdAtom = atom<number | null>(null);
