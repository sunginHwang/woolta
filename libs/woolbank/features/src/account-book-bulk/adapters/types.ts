/**
 * 카드 내역서 어댑터 계약.
 *
 * 카드사마다 내보내기 스펙이 전혀 다르다 — 컬럼 이름·순서는 물론이고 파일 형식조차 다르다
 * (현대카드의 `.xls` 는 실제로는 HTML 문서다). 그래서 "파일 → 공통 초안" 변환만 어댑터가 책임지고,
 * 그 뒤의 편집·등록 흐름은 카드사를 모른 채 공통 타입 하나로 굴린다.
 *
 * 새 카드사를 붙이려면 이 인터페이스를 구현해 registry 에 등록하기만 하면 된다.
 */

/** 어댑터가 뽑아낸 거래 한 건 — 아직 카테고리가 없는 초안 상태다. */
export interface ParsedStatementRow {
  /**
   * 원본에서 이 행을 식별하는 키. 같은 파일을 다시 파싱해도 같은 값이 나와야 한다.
   * 편집 중 React key 로 쓰고, 중복 검사에서도 기준이 된다.
   */
  sourceKey: string;
  /** 거래일 (YYYY-MM-DD). 사용자가 고칠 수 없고 표시만 한다. */
  date: string;
  /**
   * 가맹점·상대방 이름. **가맹점 기억의 키**이자 같은 가맹점 자동 전파의 기준이다.
   * 제목과 분리한 이유는 은행 내역 때문이다 — 제목엔 송금메모가 붙지만(건마다 다르다)
   * 기억은 상대방 단위로 묶여야 "정혜진에게 보낸 건"이 한 카테고리로 모인다.
   */
  merchant: string;
  /**
   * 제목 기본값. 사용자가 편집할 시작점이다.
   * 대부분 merchant 와 같지만, 은행은 "상대방 + 송금메모" 로 조합한다.
   */
  title: string;
  /** 금액 (원, 양수) */
  amount: number;
  /** 수입/지출. 카드 내역은 대부분 지출이지만 카드사에 따라 입금 행이 섞인다. */
  type: 'EXPENDITURE' | 'INCOME';
  /** 화면에 참고로만 보여주는 원본 부가정보 (승인시각, 할부 등) */
  note?: string;
}

export interface ParseResult {
  rows: ParsedStatementRow[];
  /**
   * 어댑터가 의도적으로 버린 행 수와 이유.
   * 조용히 사라지면 사용자가 "왜 건수가 안 맞지" 를 알 수 없다.
   */
  skipped: { reason: string; count: number }[];
}

export interface CardStatementAdapter {
  /** 레지스트리 식별자 */
  id: string;
  /** 화면에 보여줄 카드사 이름 */
  label: string;
  /**
   * 이 어댑터가 처리할 수 있는 파일인지 판정한다.
   * 파일명만으로는 못 믿으므로(사용자가 이름을 바꾼다) 내용으로 판정한다.
   */
  canParse: (input: StatementFileInput) => boolean;
  parse: (input: StatementFileInput) => ParseResult;
}

/**
 * 어댑터에 넘기는 파일.
 *
 * 카드사마다 실제 형식이 다르다 — 현대카드의 `.xls` 는 HTML 문서고, 국민은행의 `.xls` 는
 * 진짜 바이너리 엑셀(OLE2/BIFF)이다. 레지스트리가 두 형태를 모두 준비해 넘기고
 * 각 어댑터는 자기에게 필요한 쪽만 본다.
 */
export interface StatementFileInput {
  fileName: string;
  /** 파일 전체 텍스트 (인코딩 변환까지 끝난 상태). 바이너리 파일이면 의미 없는 값이 들어있다. */
  text: string;
  /**
   * 바이너리 엑셀을 해독한 첫 시트. 셀은 전부 문자열로 정규화돼 있다.
   * 엑셀이 아니거나 해독에 실패하면 undefined.
   */
  sheet?: string[][];
}
