import { abbreviateWon, formatWon, MINUS_SIGN, parseWon } from './money';

describe('formatWon', () => {
  it('천 단위 콤마와 원 단위를 붙인다', () => {
    expect(formatWon(4973904)).toBe('4,973,904원');
    expect(formatWon(0)).toBe('0원');
  });

  it('sign 옵션이면 양수는 +, 음수는 U+2212 마이너스를 붙이고 0 은 부호가 없다', () => {
    expect(formatWon(264000, { sign: true })).toBe('+264,000원');
    expect(formatWon(-44650, { sign: true })).toBe(`${MINUS_SIGN}44,650원`);
    expect(formatWon(0, { sign: true })).toBe('0원');
  });

  it('sign 옵션이 없으면 음수도 절댓값으로 보여준다', () => {
    expect(formatWon(-1200)).toBe('1,200원');
  });
});

describe('abbreviateWon', () => {
  it('1만 원 이상은 만 단위 소수 1자리로 줄인다', () => {
    expect(abbreviateWon(47000)).toBe('4.7만');
    expect(abbreviateWon(264000)).toBe('26.4만');
    expect(abbreviateWon(1_000_000)).toBe('100만');
  });

  it('소수 끝의 0 은 떼고, 반올림 경계를 처리한다', () => {
    expect(abbreviateWon(49950)).toBe('5만');
    expect(abbreviateWon(10000)).toBe('1만');
  });

  it('1만 원 미만은 콤마만 찍는다', () => {
    expect(abbreviateWon(9900)).toBe('9,900');
    expect(abbreviateWon(0)).toBe('0');
  });

  it('sign 옵션을 지원한다', () => {
    expect(abbreviateWon(-47000, { sign: true })).toBe(`${MINUS_SIGN}4.7만`);
    expect(abbreviateWon(264000, { sign: true })).toBe('+26.4만');
  });
});

describe('parseWon', () => {
  it('콤마·단위가 섞인 입력에서 숫자만 남긴다', () => {
    expect(parseWon('450,000원')).toBe(450000);
    expect(parseWon('1,000,000')).toBe(1_000_000);
  });

  it('숫자가 없으면 0', () => {
    expect(parseWon('')).toBe(0);
    expect(parseWon('abc')).toBe(0);
  });
});
