import { composeKbTitle, kbBankAdapter, parseKbSheet } from './kbBankAdapter';

/** 실제 파일과 같은 모양 — 위 네 줄은 계좌 메타, 다섯째 줄이 헤더다 */
const buildSheet = (dataRows: string[][]): string[][] => [
  ['조회기간', '2026.07.15 ~ 2026.09.11', '', '', '', '', '', '', ''],
  ['계좌번호', '711702-00-033052', '', '', '총잔액', '1776763.0', '', '', ''],
  ['예금종류', 'KB 통장', '', '', '출금가능금액', '1776763.0', '', '', ''],
  ['', '', '', '', '', '', '', '', ''],
  ['거래일시', '적요', '보낸분/받는분', '송금메모', '출금액', '입금액', '잔액', '거래점', '구분'],
  ...dataRows,
];

const row = ({
  dateTime = '2026.09.03 10:52:18',
  summary = '스마트출금',
  counterparty = '정혜진',
  memo = '',
  withdrawal = '110000.0',
  deposit = '0.0',
} = {}) => [dateTime, summary, counterparty, memo, withdrawal, deposit, '1771633.0', '온양', ''];

describe('composeKbTitle 테스트', () => {
  it('메모가 없으면 보낸분/받는분만 쓴다.', () => {
    // Given
    // When
    // Then
    expect(composeKbTitle('(주)카카오스타일', '')).toBe('(주)카카오스타일');
  });

  it('메모가 이름과 같으면 한 번만 쓴다.', () => {
    // Given
    // When
    // Then
    expect(composeKbTitle('정혜진', '정혜진')).toBe('정혜진');
  });

  it('메모가 이름과 다르면 둘을 잇는다.', () => {
    // Given
    // When
    // Then
    expect(composeKbTitle('일산동구(황성인)', '주밍세')).toBe('일산동구(황성인) 주밍세');
  });

  it('이름이 비고 메모만 있으면 메모를 쓴다.', () => {
    // Given
    // When
    // Then
    expect(composeKbTitle('', '파판10')).toBe('파판10');
  });

  it('이름·메모가 모두 비면 적요로 떨어진다. (ATM입금처럼 상대방이 없는 거래)', () => {
    // Given
    // When
    // Then
    expect(composeKbTitle('', '', 'ATM입금')).toBe('ATM입금');
  });
});

describe('parseKbSheet 테스트', () => {
  describe('수입/지출 판정 테스트', () => {
    it('출금액이 있으면 지출로 본다.', () => {
      // Given
      const sheet = buildSheet([row({ withdrawal: '110000.0', deposit: '0.0' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows[0]).toMatchObject({ type: 'EXPENDITURE', amount: 110000 });
    });

    it('입금액이 있으면 수입으로 본다.', () => {
      // Given
      const sheet = buildSheet([row({ counterparty: '(주)카카오스타일', withdrawal: '0.0', deposit: '231000.0' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows[0]).toMatchObject({ type: 'INCOME', amount: 231000 });
    });

    it('둘 다 0 인 행은 거래가 아니므로 버린다.', () => {
      // Given
      const sheet = buildSheet([row({ withdrawal: '0.0', deposit: '0.0' })]);

      // When
      const { rows, skipped } = parseKbSheet(sheet);

      // Then
      expect(rows).toHaveLength(0);
      expect(skipped).toContainEqual({ reason: '금액·상대방을 읽을 수 없는 행', count: 1 });
    });
  });

  describe('제목 조합 테스트', () => {
    it('상대방과 송금메모를 조합해 제목을 만든다.', () => {
      // Given
      const sheet = buildSheet([row({ counterparty: '일산동구(황성인)', memo: '주밍세' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then — 제목은 조합, 기억 키(merchant)는 상대방 이름만
      expect(rows[0].title).toBe('일산동구(황성인) 주밍세');
      expect(rows[0].merchant).toBe('일산동구(황성인)');
    });

    it('메모가 이름과 같으면 제목에 한 번만 넣는다.', () => {
      // Given
      const sheet = buildSheet([row({ counterparty: '정혜진', memo: '정혜진' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows[0].title).toBe('정혜진');
    });

    it('상대방이 없는 ATM입금도 버리지 않는다.', () => {
      // Given
      const sheet = buildSheet([
        row({ summary: 'ATM입금', counterparty: '', memo: '', withdrawal: '0', deposit: '220000' }),
      ]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({ merchant: 'ATM입금', title: 'ATM입금', type: 'INCOME', amount: 220000 });
    });
  });

  describe('형식 처리 테스트', () => {
    it('계좌 메타 네 줄을 건너뛰고 헤더 아래부터 읽는다.', () => {
      // Given
      const sheet = buildSheet([row(), row({ dateTime: '2026.09.01 09:41:02' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows).toHaveLength(2);
    });

    it('메타 줄 수가 달라져도 헤더 문구로 위치를 찾는다.', () => {
      // Given
      const sheet = parseKbSheetInputWithExtraMeta();

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows).toHaveLength(1);
    });

    it('"231000.0" 같은 소수 표기를 정수 원으로 바꾼다.', () => {
      // Given
      const sheet = buildSheet([row({ withdrawal: '12870.0' })]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows[0].amount).toBe(12870);
    });

    it('과거 → 현재 순서로 뒤집어 반환한다. (원본은 최신순)', () => {
      // Given
      const sheet = buildSheet([
        row({ dateTime: '2026.09.10 14:51:45', counterparty: '최신' }),
        row({ dateTime: '2026.07.15 15:53:18', counterparty: '과거' }),
      ]);

      // When
      const { rows } = parseKbSheet(sheet);

      // Then
      expect(rows.map((r) => r.merchant)).toEqual(['과거', '최신']);
    });
  });
});

/** 메타 줄이 하나 더 붙은 시트 */
const parseKbSheetInputWithExtraMeta = (): string[][] => [
  ['안내', '이 문서는 전산 출력물입니다', '', '', '', '', '', '', ''],
  ...buildSheet([row()]),
];

describe('kbBankAdapter.canParse 테스트', () => {
  it('해독된 시트에 헤더 문구가 있으면 처리할 수 있다고 판정한다.', () => {
    // Given
    const sheet = buildSheet([row()]);

    // When
    // Then
    expect(kbBankAdapter.canParse({ fileName: 'kb.xls', text: '', sheet })).toBe(true);
  });

  it('시트가 없으면(엑셀이 아니면) 거절한다.', () => {
    // Given
    // When
    // Then
    expect(kbBankAdapter.canParse({ fileName: 'kb.xls', text: '<html>현대카드</html>' })).toBe(false);
  });

  it('엑셀이어도 헤더가 다르면 거절한다.', () => {
    // Given
    const sheet = [['날짜', '내용', '금액']];

    // When
    // Then
    expect(kbBankAdapter.canParse({ fileName: 'kb.xls', text: '', sheet })).toBe(false);
  });
});
