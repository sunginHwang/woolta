import { hyundaiCardAdapter } from './hyundaiCardAdapter';
import { kbBankAdapter } from './kbBankAdapter';
import type { CardStatementAdapter, ParseResult, StatementFileInput } from './types';

/**
 * 지원하는 내역서 어댑터 목록.
 * 새 카드사·은행은 어댑터를 만들어 이 배열에 넣기만 하면 된다 — 화면·등록 흐름은 건드리지 않는다.
 */
export const CARD_STATEMENT_ADAPTERS: CardStatementAdapter[] = [hyundaiCardAdapter, kbBankAdapter];

export class UnsupportedStatementError extends Error {
  constructor() {
    super('지원하지 않는 내역서 형식이에요. 카드사·은행에서 받은 원본 파일인지 확인해주세요.');
    this.name = 'UnsupportedStatementError';
  }
}

export interface StatementParseOutcome extends ParseResult {
  adapter: CardStatementAdapter;
}

/**
 * 파일 내용으로 어댑터를 고른다.
 * 파일명·확장자는 믿지 않는다 — 사용자가 이름을 바꾸고, 카드사끼리 확장자가 겹친다.
 */
export const parseStatement = (input: StatementFileInput): StatementParseOutcome => {
  const adapter = CARD_STATEMENT_ADAPTERS.find((candidate) => candidate.canParse(input));

  if (!adapter) {
    throw new UnsupportedStatementError();
  }

  return { adapter, ...adapter.parse(input) };
};

/** OLE2 복합 문서(레거시 .xls) 시그니처 */
const OLE2_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
/** ZIP 시그니처 — .xlsx 는 ZIP 컨테이너다 */
const ZIP_MAGIC = [0x50, 0x4b, 0x03, 0x04];

const startsWith = (bytes: Uint8Array, magic: number[]) => magic.every((byte, index) => bytes[index] === byte);

/**
 * 카드사 내보내기는 EUC-KR 인 경우가 흔해 UTF-8 로 먼저 읽고 깨짐(U+FFFD)이 보이면 되읽는다.
 * 한글이 통째로 깨지면 헤더 판정부터 실패하므로 파싱 전에 해결해야 한다.
 */
const decodeText = (buffer: ArrayBuffer) => {
  const utf8 = new TextDecoder('utf-8').decode(buffer);

  if (!utf8.includes('�')) {
    return utf8;
  }

  try {
    return new TextDecoder('euc-kr').decode(buffer);
  } catch {
    // 브라우저가 euc-kr 를 모르면 원래 결과로 진행한다 — 판정에서 걸러진다
    return utf8;
  }
};

/**
 * 바이너리 엑셀을 첫 시트의 문자열 행렬로 해독한다.
 *
 * 파서(xlsx)는 **엑셀 파일일 때만 동적으로 불러온다.** 1MB 가까운 라이브러리라
 * 정적 import 하면 HTML 내역서만 올리는 사용자까지 값을 치르게 된다.
 *
 * `header: 1` 로 읽어 셀을 배열로 받는다 — 시트 내용이 객체 키가 되지 않으므로
 * 이 버전(0.18.5)에 남아 있는 프로토타입 오염 이슈의 표면을 줄인다.
 */
const decodeSheet = async (buffer: ArrayBuffer): Promise<string[][] | undefined> => {
  const bytes = new Uint8Array(buffer);

  if (!startsWith(bytes, OLE2_MAGIC) && !startsWith(bytes, ZIP_MAGIC)) {
    return undefined;
  }

  try {
    const { read, utils } = await import('xlsx');
    const workbook = read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    if (!firstSheet) {
      return undefined;
    }

    const raw = utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, raw: true, defval: '' });
    return raw.map((row) => row.map((cell) => (cell === null || cell === undefined ? '' : String(cell))));
  } catch {
    // 암호 걸린 파일 등 — 판정에서 걸러져 "지원하지 않는 형식" 으로 안내된다
    return undefined;
  }
};

/** 업로드된 파일을 어댑터가 볼 수 있는 형태로 준비한다. */
export const readStatementFile = async (file: File): Promise<StatementFileInput> => {
  const buffer = await file.arrayBuffer();

  return {
    fileName: file.name,
    text: decodeText(buffer),
    sheet: await decodeSheet(buffer),
  };
};
