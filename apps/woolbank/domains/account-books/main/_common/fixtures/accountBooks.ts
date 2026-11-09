import type { AccountBook } from '../hooks/useAccountBookList';

const category = (id: number, name: string, type: AccountBook['type'] = 'EXPENDITURE') => ({
  id: String(id),
  name,
  type,
  useStatistic: true,
  accountBookCategoryImageId: id,
  accountBookCategoryImage: { id: String(id), name, imageUrl: `https://static.woolta.com/category/${id}.png` },
});

const item = (
  id: number,
  title: string,
  amount: number,
  date: string,
  cat: ReturnType<typeof category>,
  extra: Partial<AccountBook> = {},
): AccountBook => ({
  id: String(id),
  title,
  amount,
  memo: '',
  type: cat.type,
  registerDateTime: `${date}T12:00:00.000Z`,
  isDisabledBudget: false,
  isRegularExpenditure: false,
  installmentMonth: null,
  paidInstallmentMonth: null,
  regularDate: null,
  accountBookCategoryId: Number(cat.id),
  accountBookCategory: cat,
  ...extra,
});

const FOOD = category(1, '외식/배달');
const MART = category(2, '편의점 및 마트');
const CAFE = category(3, '카페(커피집)');
const INSURANCE = category(4, '보험');
const SALARY = category(9, '월급', 'INCOME');

/** 스토리용 2026년 11월 가계부 — 6일에 수입이 있고 4·5·6일에 지출이 있다 */
export const ACCOUNT_BOOK_FIXTURES: AccountBook[] = [
  item(1, '타코배달', 44_650, '2026-11-04', FOOD),
  item(2, '혜진아침', 3_650, '2026-11-04', MART),
  item(3, '파히타 배달 전체', 44_300, '2026-11-04', FOOD),
  item(4, '혜진이빵', 3_650, '2026-11-04', CAFE),
  item(5, '점심 김밥', 9_500, '2026-11-05', FOOD),
  item(6, '아메리카노', 4_500, '2026-11-05', CAFE),
  item(7, '삼성화재', 12_000, '2026-11-06', INSURANCE, { isRegularExpenditure: true, regularDate: 6 }),
  item(8, '11월 월급', 264_000, '2026-11-06', SALARY),
  item(9, '주말 장보기', 54_000, '2026-11-14', MART),
];
