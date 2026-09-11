import type { JSONContent } from '@tiptap/core';
import type { MemoPartsFragment, MemoSummaryPartsFragment } from './api/gql.generated';

/** 목록용 메모 요약 — 서버가 본문(content)을 내려주지 않는다. */
export type MemoSummary = MemoSummaryPartsFragment;

/** 상세 메모 — JSON 스칼라로 내려온 본문을 Tiptap 문서 타입으로 좁힌 형태. */
export interface Memo extends Omit<MemoPartsFragment, 'content'> {
  /** 메모 본문 (Tiptap JSON) */
  content: JSONContent;
}
