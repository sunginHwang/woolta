export type AccountBookCategoryType = 'EXPENDITURE' | 'INCOME';

/*
 * 가계부 타입에 따른 한글 msg 반환
 * */
export default function getCategoryMsg(type: AccountBookCategoryType) {
  return type === 'INCOME' ? '수입' : '지출';
}
