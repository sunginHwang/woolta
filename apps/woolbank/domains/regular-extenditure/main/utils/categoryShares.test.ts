import type { RegularExpenditureListItem } from '../hooks/useRegularExtentureListQuery';
import { getCategoryShares } from './categoryShares';

const group = (name: string, amounts: number[]): RegularExpenditureListItem =>
  ({ name, type: 'EXPENDITURE', imageUrl: '', list: amounts.map((amount) => ({ amount })) }) as never;

describe('getCategoryShares', () => {
  it('금액 내림차순 상위 3개에 색을 주고 나머지는 그 외로 합친다', () => {
    const shares = getCategoryShares([
      group('구독서비스', [10]),
      group('대출/투자', [800, 30]),
      group('가전/가구', [100]),
      group('보험', [40]),
      group('교통', [20]),
    ]);

    expect(shares.map((s) => s.name)).toEqual(['대출/투자', '가전/가구', '보험', '그 외']);
    expect(shares.map((s) => s.tone)).toEqual(['strong', 'info', 'warning', 'muted']);
    expect(shares[0].percent).toBe(83);
    expect(shares[3].amount).toBe(30);
  });

  it('3개 이하면 그 외가 없다', () => {
    expect(getCategoryShares([group('a', [1]), group('b', [2])]).map((s) => s.name)).toEqual(['b', 'a']);
  });

  it('총액이 0 이면 빈 배열', () => {
    expect(getCategoryShares([group('a', [0])])).toEqual([]);
  });
});
