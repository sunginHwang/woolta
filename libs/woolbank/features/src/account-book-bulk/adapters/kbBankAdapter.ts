import type { CardStatementAdapter, ParsedStatementRow, ParseResult, StatementFileInput } from './types';

/**
 * 국민은행 "거래내역조회" 어댑터.
 *
 * 현대카드와 달리 **진짜 바이너리 엑셀**(OLE2/BIFF)이라 레지스트리가 미리 해독한 시트를 받는다.
 * 위 네 줄은 계좌 메타데이터(조회기간·계좌번호·예금종류)이고 헤더는 그 아래에 있어,
 * 고정 행 번호 대신 헤더 문구를 찾아 위치를 잡는다 — 은행이 메타 줄 수를 바꿔도 버티게.
 *
 * 컬럼: 거래일시 · 적요 · 보낸분/받는분 · 송금메모 · 출금액 · 입금액 · 잔액 · 거래점 · 구분
 */

const HEADER_TOKENS = ['거래일시', '보낸분/받는분', '송금메모', '출금액', '입금액'];

const COLUMN = {
  dateTime: 0,
  summary: 1,
  counterparty: 2,
  memo: 3,
  withdrawal: 4,
  deposit: 5,
} as const;

/** "2026.09.10 14:51:45" → { date: '2026-09-10', time: '14:51' } */
const parseDateTime = (value: string) => {
  const matched = value.match(/(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!matched) {
    return null;
  }

  const [, year, month, day, hour, minute] = matched;
  return {
    date: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    time: hour ? `${hour.padStart(2, '0')}:${minute}` : '',
  };
};

/** 엑셀 수치 셀은 "231000.0" 처럼 내려온다. 원 단위라 소수는 버린다. */
const toAmount = (value: string) => {
  const parsed = Number(String(value).replace(/[^\d.-]/g, ''));
  return Number.isFinite(parsed) ? Math.round(parsed) : 0;
};

/**
 * 제목 = 보낸분/받는분 + 송금메모.
 *
 * 실제 데이터에서 셋으로 갈린다:
 * - 메모 없음(대부분) → 이름만
 * - 메모가 이름과 같음 → 하나만 ("정혜진 정혜진" 이 되면 안 된다)
 * - 메모가 다름 → 둘을 잇는다 ("일산동구(황성인) 주밍세")
 *
 * 둘 다 비는 거래가 있다(ATM입금 등 상대방이 없는 건). 그대로 두면 제목이 빈 문자열이라
 * 행이 통째로 버려지므로 적요("ATM입금")를 마지막 안전망으로 쓴다.
 */
export const composeKbTitle = (counterparty: string, memo: string, summary = '') => {
  const who = counterparty.trim();
  const note = memo.trim();

  if (who === '' && note === '') {
    return summary.trim();
  }
  if (note === '' || note === who) {
    return who;
  }
  return who === '' ? note : `${who} ${note}`;
};

/** 시트에서 헤더 행 위치를 찾는다. 못 찾으면 -1. */
const findHeaderIndex = (sheet: string[][]) =>
  sheet.findIndex((row) => HEADER_TOKENS.every((token) => row.some((cell) => cell.trim() === token)));

/** 해독된 시트 → 공통 초안. 순수 함수라 단위 테스트가 이 로직을 직접 검증한다. */
export const parseKbSheet = (sheet: string[][]): ParseResult => {
  const headerIndex = findHeaderIndex(sheet);
  const rows: ParsedStatementRow[] = [];
  let malformedCount = 0;

  if (headerIndex === -1) {
    return { rows, skipped: [] };
  }

  sheet.slice(headerIndex + 1).forEach((cells, index) => {
    const parsedDateTime = parseDateTime(cells[COLUMN.dateTime] ?? '');
    if (parsedDateTime === null) {
      return;
    }

    const withdrawal = toAmount(cells[COLUMN.withdrawal] ?? '');
    const deposit = toAmount(cells[COLUMN.deposit] ?? '');

    // 출금액이 있으면 지출, 입금액이 있으면 수입. 둘 다 0 인 행은 거래가 아니다.
    const isExpenditure = withdrawal > 0;
    const amount = isExpenditure ? withdrawal : deposit;

    const summary = (cells[COLUMN.summary] ?? '').trim();
    const title = composeKbTitle(cells[COLUMN.counterparty] ?? '', cells[COLUMN.memo] ?? '', summary);

    if (amount <= 0 || title === '') {
      malformedCount += 1;
      return;
    }

    rows.push({
      // 은행은 승인번호를 주지 않는다. 같은 초에 같은 금액이 겹칠 수 있어 행 위치까지 섞는다.
      sourceKey: `kb:${parsedDateTime.date}:${parsedDateTime.time}:${amount}:${index}`,
      date: parsedDateTime.date,
      // 기억의 키는 상대방 이름 — 송금메모는 건마다 달라 묶는 기준이 못 된다
      merchant: (cells[COLUMN.counterparty] ?? '').trim() || title,
      title,
      amount,
      type: isExpenditure ? 'EXPENDITURE' : 'INCOME',
      note: [parsedDateTime.time, summary].filter(Boolean).join(' · '),
    });
  });

  const skipped: ParseResult['skipped'] = [];
  if (malformedCount > 0) {
    skipped.push({ reason: '금액·상대방을 읽을 수 없는 행', count: malformedCount });
  }

  // 최신순으로 내려오므로 과거 → 현재로 뒤집어 가계부 입력 순서와 맞춘다
  rows.reverse();

  return { rows, skipped };
};

export const kbBankAdapter: CardStatementAdapter = {
  id: 'kb-bank',
  label: '국민은행',

  canParse: ({ sheet }: StatementFileInput) => sheet !== undefined && findHeaderIndex(sheet) !== -1,

  parse: ({ sheet }: StatementFileInput): ParseResult => (sheet ? parseKbSheet(sheet) : { rows: [], skipped: [] }),
};

// 제목 조합 규칙을 화면에서도 재사용할 수 있도록 이름을 노출한다
export { HEADER_TOKENS as KB_HEADER_TOKENS };
