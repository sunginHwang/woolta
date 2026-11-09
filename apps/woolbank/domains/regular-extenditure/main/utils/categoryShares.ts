import type { RegularExpenditureListItem } from '../hooks/useRegularExtentureListQuery';

export type ShareTone = 'strong' | 'info' | 'warning' | 'muted';

export interface CategoryShare {
  name: string;
  amount: number;
  /** 0–100, 반올림 */
  percent: number;
  tone: ShareTone;
}

const TOP_TONES: ShareTone[] = ['strong', 'info', 'warning'];
const TOP_COUNT = TOP_TONES.length;

/**
 * 카테고리 비중 — 금액 내림차순 상위 3개는 색을 받고, 나머지는 "그 외" 하나로 합친다.
 * 그룹이 3개 이하면 "그 외" 가 없다. 총액이 0 이면 빈 배열.
 */
export const getCategoryShares = (groups: RegularExpenditureListItem[]): CategoryShare[] => {
  const summed = groups
    .map((group) => ({ name: group.name, amount: group.list.reduce((acc, item) => acc + item.amount, 0) }))
    .filter((group) => group.amount > 0)
    .sort((a, b) => b.amount - a.amount);
  const total = summed.reduce((acc, group) => acc + group.amount, 0);

  if (total === 0) {
    return [];
  }

  const percentOf = (amount: number) => Math.round((amount / total) * 100);
  const top = summed.slice(0, TOP_COUNT).map((group, index) => ({
    ...group,
    percent: percentOf(group.amount),
    tone: TOP_TONES[index],
  }));
  const restAmount = summed.slice(TOP_COUNT).reduce((acc, group) => acc + group.amount, 0);

  if (restAmount === 0) {
    return top;
  }

  return [...top, { name: '그 외', amount: restAmount, percent: percentOf(restAmount), tone: 'muted' }];
};
