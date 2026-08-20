import type { JSONContent } from '@tiptap/core';

export interface Memo {
  /** 메모 고유 id */
  id: string;
  /** 메모 제목 */
  title: string;
  /** 메모 본문 (Tiptap JSON) */
  content: JSONContent;
  /** 작성일 (ISO 문자열) */
  createdAt: string;
  /** 수정일 (ISO 문자열) */
  updatedAt: string;
}
