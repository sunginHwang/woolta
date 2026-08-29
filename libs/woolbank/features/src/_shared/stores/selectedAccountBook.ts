import { atom } from 'jotai';

/** 우측 패널을 작성 모드로 여는 sentinel 값 */
export const NEW_ACCOUNT_BOOK_ID = 'new' as const;

/**
 * 대시보드(woolta) 우측 패널에서 상세를 보여줄 가계부 내역 id.
 * null 이면 선택 없음(빈 패널), NEW_ACCOUNT_BOOK_ID 면 새 내역 작성 폼.
 */
export const selectedAccountBookIdAtom = atom<number | typeof NEW_ACCOUNT_BOOK_ID | null>(null);
