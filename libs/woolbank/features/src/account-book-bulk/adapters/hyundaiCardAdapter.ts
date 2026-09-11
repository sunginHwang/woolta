import type { CardStatementAdapter, ParsedStatementRow, ParseResult, StatementFileInput } from './types';

/**
 * 현대카드 "실시간 이용내역" 어댑터.
 *
 * 확장자는 `.xls` 지만 내용은 HTML 문서다(엑셀이 HTML 테이블을 열어주는 걸 이용한 내보내기).
 * 그래서 스프레드시트 라이브러리가 아니라 DOMParser 로 테이블을 읽는다 — 의존성이 늘지 않는다.
 *
 * 컬럼: 승인일 · 승인시각 · 카드구분 · 카드종류 · 가맹점명 · 승인금액 · 이용구분 · 할부개월 · 승인번호 · 취소일 · 승인구분
 */

const COLUMN = {
  date: 0,
  time: 1,
  merchant: 4,
  amount: 5,
  usageType: 6,
  installment: 7,
  approvalNo: 8,
  canceledAt: 9,
  approvalType: 10,
} as const;

const COLUMN_COUNT = 11;
const HEADER_SIGNATURE = ['승인일', '가맹점명', '승인금액', '승인구분'];

/** "2026년 09월 11일" → "2026-09-11" */
const toIsoDate = (value: string) => {
  const matched = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!matched) {
    return null;
  }
  const [, year, month, day] = matched;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/**
 * "52,160" → 52160
 * 숫자가 아닌 값("-" 등)은 null 로 돌린다 — Number("-") 는 NaN 이고
 * NaN 은 어떤 비교에도 false 라 `amount <= 0` 검사를 그냥 통과해버린다.
 */
const toAmount = (value: string) => {
  const digits = value.replace(/[^\d-]/g, '');
  const parsed = Number(digits);

  return digits === '' || !Number.isFinite(parsed) ? null : parsed;
};

const readRows = (text: string) => {
  const doc = new DOMParser().parseFromString(text, 'text/html');

  return [...doc.querySelectorAll('tr')].map((tr) =>
    [...tr.querySelectorAll('td, th')].map((cell) => (cell.textContent ?? '').replace(/ /g, ' ').trim()),
  );
};

export const hyundaiCardAdapter: CardStatementAdapter = {
  id: 'hyundai-card',
  label: '현대카드',

  canParse: ({ text }: StatementFileInput) => {
    // 파일명은 사용자가 바꿀 수 있으니 헤더 문구로 판정한다
    if (!text.includes('<tr') && !text.includes('<TR')) {
      return false;
    }
    return HEADER_SIGNATURE.every((token) => text.includes(token));
  },

  parse: ({ text }: StatementFileInput): ParseResult => {
    const rows: ParsedStatementRow[] = [];
    let canceledCount = 0;
    let malformedCount = 0;

    for (const cells of readRows(text)) {
      // 제목/헤더 행은 컬럼 수가 다르다
      if (cells.length !== COLUMN_COUNT) {
        continue;
      }

      const date = toIsoDate(cells[COLUMN.date]);
      if (date === null) {
        continue;
      }

      /**
       * 취소 내역 제외.
       *
       * 현대카드는 취소를 원거래와 짝지어 표시하지 않는다 — 취소 행은 자기 승인번호를 따로 갖고,
       * 취소된 원거래는 목록에서 빠진다. 그래서 취소 행만 버리면 되고 원거래를 되짚어 지울 필요가 없다.
       * (같은 가맹점·금액이 다시 보이면 그건 재구매다)
       */
      if (cells[COLUMN.approvalType] === '취소' || cells[COLUMN.canceledAt] !== '-') {
        canceledCount += 1;
        continue;
      }

      const amount = toAmount(cells[COLUMN.amount]);
      const merchant = cells[COLUMN.merchant];

      if (amount === null || amount <= 0 || merchant === '') {
        malformedCount += 1;
        continue;
      }

      const installmentMonth = Number(cells[COLUMN.installment]);
      const usageType = cells[COLUMN.usageType];
      const noteParts = [cells[COLUMN.time], usageType];
      if (Number.isFinite(installmentMonth) && installmentMonth > 0) {
        noteParts.push(`${installmentMonth}개월 할부`);
      }

      rows.push({
        // 승인번호는 카드사 안에서 유일하지만 파일이 잘려 비는 경우가 있어 날짜·시각을 함께 묶는다
        sourceKey: `hyundai:${date}:${cells[COLUMN.time]}:${cells[COLUMN.approvalNo]}:${amount}`,
        date,
        merchant,
        // 카드 내역은 가맹점명이 곧 제목이다
        title: merchant,
        amount,
        // 카드 이용내역은 전부 지출이다. 수입 행이 섞이는 카드사는 각자 어댑터에서 판정한다.
        type: 'EXPENDITURE',
        note: noteParts.filter(Boolean).join(' · '),
      });
    }

    const skipped: ParseResult['skipped'] = [];
    if (canceledCount > 0) {
      skipped.push({ reason: '취소된 내역', count: canceledCount });
    }
    if (malformedCount > 0) {
      skipped.push({ reason: '금액·가맹점을 읽을 수 없는 행', count: malformedCount });
    }

    // 최신순으로 내려오므로 과거 → 현재로 뒤집어 가계부 입력 순서와 맞춘다
    rows.reverse();

    return { rows, skipped };
  },
};
