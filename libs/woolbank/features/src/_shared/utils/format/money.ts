/** 지출 부호. 하이픈(-)이 아니라 수학 마이너스(U+2212)를 써서 숫자와 같은 폭으로 정렬되게 한다 */
export const MINUS_SIGN = '−';

interface SignOptions {
  /**
   * 부호 표기. `true` 면 양수에 "+", 음수에 "−" 를 붙인다. 0 은 부호 없음
   * @default false
   */
  sign?: boolean;
}

const withSign = (amount: number, text: string, sign: boolean) => {
  if (!sign || amount === 0) {
    return text;
  }

  return amount > 0 ? `+${text}` : `${MINUS_SIGN}${text}`;
};

/**
 * 원 단위 금액 문자열. `formatWon(4973904)` → "4,973,904원", `formatWon(-44650, { sign: true })` → "−44,650원"
 */
export const formatWon = (amount: number, { sign = false }: SignOptions = {}) => {
  const text = `${Math.abs(Math.round(amount)).toLocaleString('ko-KR')}원`;

  return withSign(amount, text, sign);
};

/**
 * 달력 셀처럼 좁은 자리에 쓰는 축약 금액.
 * 1만 원 이상은 "만" 단위 소수 1자리(47,000 → "4.7만", 1,000,000 → "100만"), 미만은 콤마만 찍는다(9,900 → "9,900").
 */
export const abbreviateWon = (amount: number, { sign = false }: SignOptions = {}) => {
  const abs = Math.abs(Math.round(amount));
  const text =
    abs >= 10_000
      ? `${(Math.round(abs / 1_000) / 10).toLocaleString('ko-KR', { maximumFractionDigits: 1 })}만`
      : abs.toLocaleString('ko-KR');

  return withSign(amount, text, sign);
};

/** "450000" / "450,000" 같은 입력 문자열에서 숫자만 남겨 정수로 만든다. 숫자가 없으면 0 */
export const parseWon = (text: string) => {
  const digits = text.replace(/[^0-9]/g, '');

  return digits === '' ? 0 : Number(digits);
};
