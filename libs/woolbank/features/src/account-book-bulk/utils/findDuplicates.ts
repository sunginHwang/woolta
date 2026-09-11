import dayjs from 'dayjs';
import type { AccountBook } from '../../_shared/hooks/accountBookListApi';
import type { ParsedStatementRow } from '../adapters/types';

/**
 * 중복 판정 키 — 같은 날 · 같은 금액이면 중복으로 의심한다.
 *
 * 제목은 넣지 않는다. 이미 등록된 내역은 사용자가 제목을 고쳤을 가능성이 높은데
 * (벌크 업로드의 목적 자체가 제목 수정이다) 제목까지 맞춰야 중복으로 보면 거의 안 걸린다.
 * 반대로 날짜+금액만 보면 우연히 겹치는 소액 거래가 걸리지만, 판단은 사용자가 하므로
 * 놓치는 쪽보다 과하게 표시하는 쪽이 낫다.
 */
const toKey = (date: string, amount: number) => `${date}:${amount}`;

/** 파싱 결과가 걸친 달 목록 ('YYYY-MM') — 이 달들만 기존 내역을 조회하면 된다. */
export const getCoveredMonths = (rows: ParsedStatementRow[]): string[] => {
  const months = new Set(rows.map((row) => row.date.slice(0, 7)));
  return [...months].sort();
};

/**
 * 기존 내역과 겹치는 행의 sourceKey 집합을 돌려준다.
 * 서버 등록은 막지 않고 화면에서 경고 + 기본 체크 해제로만 쓴다.
 */
export const findDuplicateSourceKeys = (rows: ParsedStatementRow[], existing: AccountBook[]): Set<string> => {
  const existingKeys = new Set(
    existing.map((item) => toKey(dayjs(item.registerDateTime).format('YYYY-MM-DD'), item.amount)),
  );

  return new Set(rows.filter((row) => existingKeys.has(toKey(row.date, row.amount))).map((row) => row.sourceKey));
};
