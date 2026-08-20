export type AccountBookCategoryType = 'expenditure' | 'income';

/*
 * 가계부 타입에 따른 한글 msg 반환
 * */
export default function getCategoryMsg(type: AccountBookCategoryType) {
  return type === 'income' ? '수입' : '지출';
}
